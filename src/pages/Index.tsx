import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { translations, Language } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const getCourses = (lang: Language) => [
  {
    id: 1,
    title: lang === 'en' ? 'Web Development Basics' : 'Основы Веб-Разработки',
    description: lang === 'en' ? 'Learn HTML, CSS, and JavaScript from scratch' : 'Изучите HTML, CSS и JavaScript с нуля',
    image: '/img/dc989b8f-6997-4193-8c54-bed64786ef1a.jpg',
    level: lang === 'en' ? 'Beginner' : 'Начальный',
    duration: lang === 'en' ? '8 weeks' : '8 недель',
    rating: 4.8,
    students: 1234,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: lang === 'en' ? 'React Advanced Patterns' : 'Продвинутые Паттерны React',
    description: lang === 'en' ? 'Master modern React development techniques' : 'Освойте современные техники разработки на React',
    image: '/img/dc989b8f-6997-4193-8c54-bed64786ef1a.jpg',
    level: lang === 'en' ? 'Advanced' : 'Продвинутый',
    duration: lang === 'en' ? '6 weeks' : '6 недель',
    rating: 4.9,
    students: 856,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: lang === 'en' ? 'UI/UX Design Principles' : 'Принципы UI/UX Дизайна',
    description: lang === 'en' ? 'Create beautiful and functional user interfaces' : 'Создавайте красивые и функциональные интерфейсы',
    image: '/img/dc989b8f-6997-4193-8c54-bed64786ef1a.jpg',
    level: lang === 'en' ? 'Intermediate' : 'Средний',
    duration: lang === 'en' ? '5 weeks' : '5 недель',
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
  const [language, setLanguage] = useState<Language>('en');
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    phone: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ru')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'ru' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = translations[language];
  const courses = getCourses(language);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-bounce');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeTab, language]);

  const handleEnroll = async () => {
    if (!selectedCourse || !formData.student_name || !formData.student_email) {
      toast({
        title: t.enrollment.errorTitle,
        description: t.enrollment.errorFields,
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
          title: t.enrollment.successTitle,
          description: `${t.enrollment.successDesc} ${selectedCourse.title}`,
        });
        setEnrollmentDialogOpen(false);
        setFormData({ student_name: '', student_email: '', phone: '' });
      } else {
        throw new Error(data.error || 'Enrollment failed');
      }
    } catch (error) {
      toast({
        title: t.enrollment.errorTitle,
        description: error instanceof Error ? error.message : t.enrollment.errorFailed,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-cyan-50 to-yellow-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-float" style={{ animationDelay: '0s' }}>👨‍🏫</div>
        <div className="absolute top-32 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>📚</div>
        <div className="absolute top-60 left-1/4 text-4xl animate-float" style={{ animationDelay: '2s' }}>🎓</div>
        <div className="absolute bottom-32 right-1/4 text-6xl animate-float" style={{ animationDelay: '0.5s' }}>🏫</div>
        <div className="absolute top-1/3 right-10 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>✏️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float" style={{ animationDelay: '2.5s' }}>📖</div>
        <div className="absolute top-1/2 left-1/3 text-5xl animate-float" style={{ animationDelay: '3s' }}>💡</div>
        <div className="absolute bottom-1/3 right-1/3 text-4xl animate-float" style={{ animationDelay: '1.8s' }}>🎯</div>
        <div className="absolute top-20 right-1/3 text-6xl animate-float" style={{ animationDelay: '2.2s' }}>🌟</div>
        <div className="absolute bottom-40 left-1/2 text-5xl animate-float" style={{ animationDelay: '0.8s' }}>🚀</div>
      </div>
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
                {t.nav.home}
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`font-medium transition-colors ${activeTab === 'schedule' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                {t.nav.schedule}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`font-medium transition-colors ${activeTab === 'reviews' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                {t.nav.reviews}
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`font-medium transition-colors ${activeTab === 'courses' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                {t.nav.courses}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all font-medium text-sm"
              >
                {language === 'en' ? '🇷🇺 RU' : '🇬🇧 EN'}
              </button>
              <Button className="bg-gradient-brand text-white border-0 hover:opacity-90 transition-opacity">
                {t.nav.getStarted}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <section className="text-center space-y-6 py-20">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-brand bg-clip-text text-transparent animate-scale-in">
                {t.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-brand text-white border-0 hover:opacity-90 transition-all hover:scale-105"
                  onClick={() => setActiveTab('courses')}
                >
                  {t.hero.exploreCourses}
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" className="hover:scale-105 transition-all">
                  {t.hero.watchDemo}
                  <Icon name="Play" className="ml-2" size={20} />
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 scroll-animate-left">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Video" className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{t.features.videoTitle}</CardTitle>
                  <CardDescription className="text-base">
                    {t.features.videoDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 scroll-animate-bounce">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Calendar" className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{t.features.scheduleTitle}</CardTitle>
                  <CardDescription className="text-base">
                    {t.features.scheduleDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 scroll-animate-right">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Award" className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{t.features.certificateTitle}</CardTitle>
                  <CardDescription className="text-base">
                    {t.features.certificateDesc}
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
                {t.courses.title}
              </h2>
              <p className="text-xl text-gray-600">{t.courses.subtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card 
                  key={course.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 scroll-animate"
                  style={{ animationDelay: `${index * 150}ms` }}
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
                          {t.courses.watchIntro}
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
                          <Dialog open={enrollmentDialogOpen} onOpenChange={setEnrollmentDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                className="w-full bg-gradient-brand text-white border-0 hover:opacity-90"
                                onClick={() => setSelectedCourse(course)}
                              >
                                {t.courses.enrollNow}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-2xl">{t.courses.enrollNow}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">{t.enrollment.name}</Label>
                                  <Input
                                    id="name"
                                    value={formData.student_name}
                                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                                    placeholder={t.enrollment.name}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">{t.enrollment.email}</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={formData.student_email}
                                    onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                                    placeholder={t.enrollment.email}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="phone">{t.enrollment.phone}</Label>
                                  <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder={t.enrollment.phone}
                                  />
                                </div>
                                <div className="flex gap-3 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEnrollmentDialogOpen(false)}
                                    className="flex-1"
                                  >
                                    {t.enrollment.cancel}
                                  </Button>
                                  <Button
                                    onClick={handleEnroll}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-brand text-white border-0 hover:opacity-90"
                                  >
                                    {isSubmitting ? t.enrollment.submitting : t.enrollment.enroll}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
            
            <Card className="overflow-hidden scroll-animate">
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
                          className="border-b hover:bg-gray-50 transition-colors"
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
                  className="hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 scroll-animate-bounce"
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