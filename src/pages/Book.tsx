import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, Check, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Booking {
  id: string;
  fullName: string;
  email: string;
  notes: string;
  painPoints: {
    workflowChallenge: string;
    sopManagement: string;
    mainGoal: string;
    limitingTools: string;
    demoPreparation: string;
  };
  date: string;
  time: string;
  createdAt: string;
  status: string;
}

const Book = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    notes: '',
    painPoints: {
      workflowChallenge: '',
      sopManagement: '',
      mainGoal: '',
      limitingTools: '',
      demoPreparation: ''
    }
  });

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-GB', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Set default date to today
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  // Generate time slots with some pre-blocked
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const dateIndex = dates.findIndex(d => d.date === date);
    
    // Pre-block 2 slots per day at different times
    const blockedSlots = [
      [1, 4], // Day 0: 11:00, 14:00
      [2, 5], // Day 1: 12:00, 15:00
      [0, 6], // Day 2: 10:00, 16:00
      [3, 1], // Day 3: 13:00, 11:00
      [4, 2], // Day 4: 14:00, 12:00
      [5, 0], // Day 5: 15:00, 10:00
      [6, 3], // Day 6: 16:00, 13:00
    ];

    const blocked = blockedSlots[dateIndex] || [1, 4];

    return times.map((time, index) => ({
      time,
      available: !blocked.includes(index)
    }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('painPoints.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        painPoints: {
          ...prev.painPoints,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const generateICS = (booking: Booking) => {
    const startDate = new Date(`${booking.date}T${booking.time}:00`);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OpsCentral//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${booking.id}@opscentral.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      'SUMMARY:OpsCentral Demo Session',
      'DESCRIPTION:Your scheduled OpsCentral demo session',
      'LOCATION:Online',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  };

  const sendConfirmationEmail = async (booking: Booking) => {
    try {
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking,
          icsContent: generateICS(booking)
        }),
      });

      if (!response.ok) {
        console.warn('Email sending failed, but booking was saved');
      }
    } catch (error) {
      console.warn('Email sending failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprConsent) return;

    setLoading(true);

    try {
      // Create booking
      const booking: Booking = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fullName: formData.fullName,
        email: formData.email,
        notes: formData.notes,
        painPoints: formData.painPoints,
        date: selectedDate,
        time: selectedTime,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // Save to localStorage (in real app, this would be a database)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      // Send confirmation email
      await sendConfirmationEmail(booking);

      setConfirmedBooking(booking);
      setShowSuccess(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleCalendarLink = (booking: Booking) => {
    const startDate = new Date(`${booking.date}T${booking.time}:00`);
    const endDate = new Date(startDate.getTime() + 30 * 60000);
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'OpsCentral Demo Session',
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: 'Your scheduled OpsCentral demo session',
      location: 'Online'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  if (showSuccess && confirmedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Booking Confirmed!
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your OpsCentral demo is scheduled for{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(confirmedBooking.date).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} at {confirmedBooking.time}
              </span>
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What's Next?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You'll receive a confirmation email with calendar details. We'll contact you shortly before your demo with joining instructions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={generateGoogleCalendarLink(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Add to Google Calendar
              </a>
              
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your OpsCentral Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Schedule a 30-minute personalized demo to see how OpsCentral can transform your workflows
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Date Selection */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Date
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {dates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => {
                    setSelectedDate(date.date);
                    setSelectedTime('');
                    setShowForm(false);
                  }}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    selectedDate === date.date
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:border-primary-500'
                  }`}
                >
                  <div className="text-sm font-medium">{date.display}</div>
                  {date.isToday && (
                    <div className="text-xs text-primary-400 mt-1">Today</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Time (Europe/London)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {generateTimeSlots(selectedDate).map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedTime === slot.time
                        ? 'bg-primary-600 text-white border-primary-600'
                        : slot.available
                        ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:border-primary-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                    {!slot.available && (
                      <div className="text-xs mt-1">Unavailable</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Booking Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Optional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Any specific topics you'd like to discuss?"
                />
              </div>

              {/* Pain Points Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Help Us Prepare (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="painPoints.workflowChallenge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What's your biggest workflow challenge right now?
                    </label>
                    <textarea
                      id="painPoints.workflowChallenge"
                      name="painPoints.workflowChallenge"
                      rows={2}
                      value={formData.painPoints.workflowChallenge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe your main workflow pain point..."
                    />
                  </div>

                  <div>
                    <label htmlFor="painPoints.sopManagement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      How do you currently manage your internal SOPs or team processes?
                    </label>
                    <textarea
                      id="painPoints.sopManagement"
                      name="painPoints.sopManagement"
                      rows={2}
                      value={formData.painPoints.sopManagement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tell us about your current SOP management..."
                    />
                  </div>

                  <div>
                    <label htmlFor="painPoints.mainGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What's the main goal you'd like to achieve through OpsCentral?
                    </label>
                    <textarea
                      id="painPoints.mainGoal"
                      name="painPoints.mainGoal"
                      rows={2}
                      value={formData.painPoints.mainGoal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="What would success look like for you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="painPoints.limitingTools" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Which tools or systems are you using today that you find limiting?
                    </label>
                    <textarea
                      id="painPoints.limitingTools"
                      name="painPoints.limitingTools"
                      rows={2}
                      value={formData.painPoints.limitingTools}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="What tools are holding you back?"
                    />
                  </div>

                  <div>
                    <label htmlFor="painPoints.demoPreparation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Is there anything specific you'd like us to prepare before your demo?
                    </label>
                    <textarea
                      id="painPoints.demoPreparation"
                      name="painPoints.demoPreparation"
                      rows={2}
                      value={formData.painPoints.demoPreparation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Any specific features or use cases to focus on?"
                    />
                  </div>
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I consent to OpsCentral storing my details and contacting me regarding my booking. My information will not be shared or used for any other purpose. *
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!gdprConsent || loading}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
                  gdprConsent && !loading
                    ? 'bg-accent-600 hover:bg-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Confirming Booking...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;