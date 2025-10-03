CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    course_id INTEGER NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    CONSTRAINT unique_enrollment UNIQUE (student_email, course_id)
);

CREATE INDEX idx_enrollments_email ON course_enrollments(student_email);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);