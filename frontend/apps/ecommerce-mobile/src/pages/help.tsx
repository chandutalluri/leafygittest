import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MobileLayout from '../components/layout/MobileLayout';
import { Phone, Mail, MessageSquare, HelpCircle, ChevronRight, Clock } from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What are your delivery timings?',
      answer:
        'We deliver between 7 AM to 9 PM every day. Same-day delivery for orders placed before 2 PM.',
    },
    {
      question: 'How can I track my order?',
      answer:
        "You can track your order from the 'Orders' section in the app. We'll also send SMS updates.",
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within 24 hours of delivery for quality issues. Please contact our support team.',
    },
    {
      question: 'Do you deliver to my area?',
      answer: 'We currently deliver to selected areas in Hyderabad, Visakhapatnam, and Vijayawada.',
    },
    {
      question: 'How do I update my delivery address?',
      answer: "You can update your address in the 'Account' section or during checkout.",
    },
  ];

  const supportOptions = [
    {
      icon: Phone,
      title: 'Call Us',
      subtitle: 'Mon-Sat, 7 AM - 9 PM',
      action: 'tel:+918885551234',
      value: '+91 888 555 1234',
    },
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: '24/7 Email Support',
      action: 'mailto:support@leafyhealth.com',
      value: 'support@leafyhealth.com',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      subtitle: 'Quick Responses',
      action: 'https://wa.me/918885551234',
      value: '+91 888 555 1234',
    },
  ];

  return (
    <>
      <Head>
        <title>Help & Support - LeafyHealth</title>
        <meta name="description" content="Get help with your LeafyHealth orders and account" />
      </Head>

      <MobileLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-4 py-4">
              <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-sm text-gray-600 mt-1">We're here to help you</p>
            </div>
          </div>

          {/* Contact Options */}
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h2>
            <div className="space-y-3">
              {supportOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.action}
                  className="bg-white rounded-lg p-4 flex items-center space-x-3 shadow-sm border border-gray-100"
                >
                  <div className="bg-green-100 p-2 rounded-full">
                    <option.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.subtitle}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{option.value}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-3">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Business Hours</h3>
              </div>
              <p className="text-sm text-gray-600">
                Monday - Saturday: 7:00 AM - 9:00 PM
                <br />
                Sunday: 8:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
}
