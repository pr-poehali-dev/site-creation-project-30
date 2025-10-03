import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const courses = [
  {
    id: 1,
    title: 'Web Development Basics',
    description: 'Learn HTML, CSS, and JavaScript from scratch',
    image: '/img/dc989b8f-6997-4193-8c54-bed64786ef1a.jpg',
    level: 'Beginner',
    duration: '8 weeks',
    rating: 4.8,
    students: 1234,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'React Advanced Patterns',
    description: 'Master modern React development techniques',
    image: '/img/dc989b8f-6997-4193-8c54-bed64786ef1a.jpg',
    level: 'Advanced',
    duration: '6 weeks',
    rating: 4.9,
    students: 856,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and functional user interfaces',
    image: '/img/dc989b8f-6997-4193-8c54-bed64786ef1a.jpg',
    level: 'Intermediate',
    duration: '5 weeks',
    rating: 4.7,
    students: 2100,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const schedule = [
  { day: 'Monday', time: '10:00 AM', course: 'Web Development Basics', instructor: 'John Smith' },
  { day: 'Tuesday', time: '2:00 PM', course: 'React Advanced Patterns', instructor: 'Sarah Johnson' },
  { day: 'Wednesday', time: '11:00 AM', course: 'UI/UX Design Principles', instructor: 'Mike Chen' },
  { day: 'Thursday', time: '3:00 PM', course: 'Web Development Basics', instructor: 'John Smith' },
  { day: 'Friday', time: '1:00 PM', course: 'React Advanced Patterns', instructor: 'Sarah Johnson' }
];

const reviews = [
  { id: 1, name: 'Anna Petrova', rating: 5, text: 'Amazing courses! The instructors are very professional and the material is well-structured.', course: 'Web Development' },
  { id: 2, name: 'Dmitry Ivanov', rating: 5, text: 'I learned so much in just a few weeks. Highly recommend to anyone starting their coding journey!', course: 'React Advanced' },
  { id: 3, name: 'Elena Sidorova', rating: 4, text: 'Great platform with excellent video quality. The schedule is flexible and convenient.', course: 'UI/UX Design' }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    phone: ''
  });
  const { toast } = useToast();

  const handleEnroll = async () => {
    if (!selectedCourse || !formData.student_name || !formData.student_email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/ce49687f-e7fa-4d8f-a0db-c48ae8886108', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_name: formData.student_name,
          student_email: formData.student_email,
          phone: formData.phone,
          course_id: selectedCourse.id,
          course_title: selectedCourse.title
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Success!',
          description: `You have been enrolled in ${selectedCourse.title}`,
        });
        setEnrollmentDialogOpen(false);
        setFormData({ student_name: '', student_email: '', phone: '' });
      } else {
        throw new Error(data.error || 'Enrollment failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to enroll. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-yellow-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                ONLINE LEARNING
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-medium transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`font-medium transition-colors ${activeTab === 'schedule' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`font-medium transition-colors ${activeTab === 'reviews' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`font-medium transition-colors ${activeTab === 'courses' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Courses
              </button>
            </div>
            <Button className="bg-gradient-brand text-white border-0 hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <section className="text-center space-y-6 py-20">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-brand bg-clip-text text-transparent animate-scale-in">
                Learn Without Limits
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Master new skills with interactive video lessons from world-class instructors
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-brand text-white border-0 hover:opacity-90 transition-all hover:scale-105"
                  onClick={() => setActiveTab('courses')}
                >
                  Explore Courses
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" className="hover:scale-105 transition-all">
                  Watch Demo
                  <Icon name="Play" className="ml-2" size={20} />
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Video" className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">HD Video Lessons</CardTitle>
                  <CardDescription className="text-base">
                    Watch high-quality video content anytime, anywhere
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Calendar" className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">Flexible Schedule</CardTitle>
                  <CardDescription className="text-base">
                    Learn at your own pace with our convenient timetable
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Award" className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">Certificate</CardTitle>
                  <CardDescription className="text-base">
                    Get recognized with industry-standard certificates
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                Our Courses
              </h2>
              <p className="text-xl text-gray-600">Choose from our selection of expert-led courses</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card 
                  key={course.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <Badge className="absolute top-4 right-4 bg-gradient-brand text-white border-0">
                      {course.level}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={16} />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-gradient-brand text-white border-0 hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <Icon name="Play" className="mr-2" size={18} />
                          Watch Intro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
                        </DialogHeader>
                        <div className="aspect-video w-full">
                          <iframe
                            width="100%"
                            height="100%"
                            src={course.videoUrl}
                            title={course.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <p className="text-gray-600">{course.description}</p>
                          <Button className="w-full bg-gradient-brand text-white border-0 hover:opacity-90">
                            Enroll Now
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                Weekly Schedule
              </h2>
              <p className="text-xl text-gray-600">Plan your learning journey with our live sessions</p>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-brand text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Day</th>
                        <th className="px-6 py-4 text-left font-semibold">Time</th>
                        <th className="px-6 py-4 text-left font-semibold">Course</th>
                        <th className="px-6 py-4 text-left font-semibold">Instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((item, index) => (
                        <tr 
                          key={index} 
                          className="border-b hover:bg-gray-50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 font-medium">{item.day}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Icon name="Clock" size={16} className="text-primary" />
                              <span>{item.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.course}</td>
                          <td className="px-6 py-4 text-gray-600">{item.instructor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                Student Reviews
              </h2>
              <p className="text-xl text-gray-600">See what our students say about their experience</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <Card 
                  key={review.id} 
                  className="hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <div className="flex space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Icon 
                            key={i} 
                            name="Star" 
                            size={16} 
                            className="fill-yellow-400 text-yellow-400" 
                          />
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">{review.course}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 italic">"{review.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                  <Icon name="GraduationCap" className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">ONLINE LEARNING</span>
              </div>
              <p className="text-gray-400">Empowering learners worldwide with quality education</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Web Development</li>
                <li className="hover:text-white transition-colors cursor-pointer">Design</li>
                <li className="hover:text-white transition-colors cursor-pointer">Business</li>
                <li className="hover:text-white transition-colors cursor-pointer">Marketing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="hover:bg-white/10">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-white/10">
                  <Icon name="Twitter" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-white/10">
                  <Icon name="Instagram" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Online Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}