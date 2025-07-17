import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - LeafyHealth</title>
        <meta
          name="description"
          content="Get in touch with LeafyHealth for any questions, support, or feedback"
        />
      </Head>

      <MobileLayout>
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h1>

          {/* Contact Methods */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <GlassCard className="p-4 text-center">
              <PhoneIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm">Call Us</h3>
              <p className="text-xs text-gray-600">+91 9876543210</p>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <EnvelopeIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm">Email</h3>
              <p className="text-xs text-gray-600">support@leafyhealth.com</p>
            </GlassCard>
          </div>

          {/* Business Hours */}
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <ClockIcon className="h-6 w-6 text-purple-500" />
              <h3 className="font-semibold text-gray-800">Business Hours</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
            </div>
          </GlassCard>

          {/* Our Location */}
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <MapPinIcon className="h-6 w-6 text-red-500" />
              <h3 className="font-semibold text-gray-800">Our Location</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>Sri Venkateswara Organic Foods</p>
              <p>123 Organic Street, Jubilee Hills</p>
              <p>Hyderabad, Telangana 500033</p>
              <p>India</p>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => window.open('tel:+919876543210')}
              className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              <PhoneIcon className="h-5 w-5" />
              <span className="text-sm">Call Now</span>
            </button>

            <button
              onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
              <span className="text-sm">WhatsApp</span>
            </button>
          </div>

          {/* Contact Form */}
          <GlassCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="product">Product Question</option>
                  <option value="subscription">Subscription Help</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.email ||
                  !formData.subject ||
                  !formData.message
                }
                className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </GlassCard>

          {/* FAQ Section */}
          <GlassCard className="p-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">How do I track my order?</h4>
                <p className="text-sm text-gray-600">
                  You can track your order using the tracking link sent to your email or visit our
                  Track Order page.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">What are your delivery areas?</h4>
                <p className="text-sm text-gray-600">
                  We deliver across Hyderabad, Secunderabad, and surrounding areas. Check our
                  delivery zones for details.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Do you offer refunds?</h4>
                <p className="text-sm text-gray-600">
                  Yes, we offer full refunds for damaged or unsatisfactory products within 24 hours
                  of delivery.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </MobileLayout>
    </>
  );
}
