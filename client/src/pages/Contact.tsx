import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our courses, need technical support, or want to partner with us? We're here to help and
            would love to hear from you.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input id="firstName" name="firstName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input id="lastName" name="lastName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input id="phone" name="phone" type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                  <select name="subject" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="course">Course Information</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="newsletter" name="newsletter" className="mt-1" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    I would like to receive updates about new courses and platform features
                  </label>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">💬</span>
                  Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">📧</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">support@directed.edu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">📞</span>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">📍</span>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">
                      123 Education Street<br />
                      Learning City, LC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">🕒</span>
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">❓</span>
                  Quick Help
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Technical Issues?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Check our Help Center for common solutions and troubleshooting guides.
                  </p>
                  <button className="text-green-600 border border-green-600 px-3 py-1 rounded text-sm hover:bg-green-50">
                    Visit Help Center
                  </button>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course Questions?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Browse our course catalog or speak with an academic advisor.
                  </p>
                  <button className="text-green-600 border border-green-600 px-3 py-1 rounded text-sm hover:bg-green-50">
                    Browse Courses
                  </button>
                </div>
              </div>
            </div>

            <div className="border-green-600 bg-green-50 rounded-lg shadow-sm border p-6">
              <h4 className="font-medium text-green-700 mb-2">Emergency Support</h4>
              <p className="text-sm text-green-700 mb-3">
                For urgent technical issues affecting your learning, contact our emergency support line.
              </p>
              <p className="font-medium text-green-700">+1 (555) 911-HELP</p>
              <p className="text-xs text-green-700 mt-1">Available 24/7</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}