import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel, EmailStr, Field, ValidationError
from typing import Dict, Any, Optional

class EnrollmentRequest(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=255)
    student_email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    course_id: int = Field(..., gt=0)
    course_title: str = Field(..., min_length=1, max_length=255)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle course enrollment requests and store them in database
    Args: event with httpMethod, body; context with request_id
    Returns: HTTP response with enrollment confirmation
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            enrollment = EnrollmentRequest(**body_data)
            
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Database configuration missing'}),
                    'isBase64Encoded': False
                }
            
            conn = psycopg2.connect(database_url)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute(
                """
                INSERT INTO course_enrollments 
                (student_name, student_email, phone, course_id, course_title, status)
                VALUES (%s, %s, %s, %s, %s, 'pending')
                ON CONFLICT (student_email, course_id) 
                DO UPDATE SET 
                    student_name = EXCLUDED.student_name,
                    phone = EXCLUDED.phone,
                    enrolled_at = CURRENT_TIMESTAMP
                RETURNING id, student_name, student_email, course_title, enrolled_at, status
                """,
                (enrollment.student_name, enrollment.student_email, enrollment.phone, 
                 enrollment.course_id, enrollment.course_title)
            )
            
            result = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Successfully enrolled in course',
                    'enrollment': dict(result)
                }, default=str),
                'isBase64Encoded': False
            }
            
        except ValidationError as e:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid input', 'details': e.errors()}),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    if method == 'GET':
        try:
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Database configuration missing'}),
                    'isBase64Encoded': False
                }
            
            conn = psycopg2.connect(database_url)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute(
                """
                SELECT id, student_name, student_email, phone, course_id, course_title, 
                       enrolled_at, status
                FROM course_enrollments
                ORDER BY enrolled_at DESC
                LIMIT 100
                """
            )
            
            enrollments = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'enrollments': [dict(e) for e in enrollments]
                }, default=str),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
