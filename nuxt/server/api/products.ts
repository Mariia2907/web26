export default defineEventHandler((event) => {
  return [
    {
      id: 1,
      name: 'Starter - Annual',
      trial: '3-days free then:',
      price: '$83.25',
      oldYearlyPrice: '$1,188',
      newYearlyPrice: '$999',
      savings: '$189 in savings',
      buttonText: 'Try It Free',
      tooltip: 'You cannot downgrade your plan until within 30 days of your next billing date.',
      features: [
        { main: '<span class="font-medium text-gray-800">Primary user only</span>', sub: '(extra team members for $35/month)' },
        { main: '<span class="font-medium text-gray-800">Save unlimited properties</span>', sub: '' },
        { main: '<span class="font-bold text-gray-900">10,000</span> <span class="font-medium text-gray-800">exports</span>', sub: '(additional exports at $0.02 each)' },
        { main: '<span class="font-bold text-gray-900">500</span> <span class="font-medium text-gray-800">free skip traces</span>', sub: '(additional skip tracing at $0.08 each)' },
        { main: '<span class="font-medium text-gray-800">Imports $0.01</span>', sub: '' },
        { main: '<span class="font-bold text-gray-900">FREE</span> <span class="font-medium text-gray-800">daily product trainings and support</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Full suite of next-gen investing tools</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Industry first AI powered comp tool</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Includes dedicated support agent</span>', sub: '' }
      ]
    },
    {
      id: 2,
      name: 'Team - Annual',
      trial: '3-days free then:',
      price: '$207.50',
      oldYearlyPrice: '$2,988',
      newYearlyPrice: '$2,490',
      savings: '$498 in savings',
      buttonText: 'Try It Free',
      tooltip: 'You can upgrade your team plan at any time from your dashboard.',
      features: [
        { main: '<span class="font-medium text-gray-800">Primary user + 2 free team members</span>', sub: '(extra team members for $25/month)' },
        { main: '<span class="font-medium text-gray-800">Save unlimited properties</span>', sub: '' },
        { main: '<span class="font-bold text-gray-900">50,000</span> <span class="font-medium text-gray-800">exports</span>', sub: '(additional exports at $0.01 each)' },
        { main: '<span class="font-bold text-gray-900">1,000</span> <span class="font-medium text-gray-800">free skip traces</span>', sub: '(additional skip tracing at $0.08 each)' },
        { main: '<span class="font-medium text-gray-800">Imports $0.01</span>', sub: '' },
        { main: '<span class="font-bold text-gray-900">FREE</span> <span class="font-medium text-gray-800">daily product trainings and support</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Full suite of next-gen investing tools</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Industry first AI powered comp tool</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Includes dedicated support agent</span>', sub: '' }
      ]
    },
    {
      id: 3,
      name: 'Business - Annual',
      trial: '3-days free then:',
      price: '$457.50',
      oldYearlyPrice: '$6,588',
      newYearlyPrice: '$5,490',
      savings: '$1,098 in savings',
      buttonText: 'Try It Free',
      tooltip: 'Business plans require a 30-day notice for cancellation.',
      features: [
        { main: '<span class="font-medium text-gray-800">Primary user + 6 free team members</span>', sub: '(extra team members for $20/month)' },
        { main: '<span class="font-medium text-gray-800">Save unlimited properties</span>', sub: '' },
        { main: '<span class="font-bold text-gray-900">100,000</span> <span class="font-medium text-gray-800">exports</span>', sub: '(additional exports at $0.01 each)' },
        { main: '<span class="font-bold text-gray-900">2,000</span> <span class="font-medium text-gray-800">free skip traces</span>', sub: '(additional skip tracing at $0.08 each)' },
        { main: '<span class="font-medium text-gray-800">Imports $0.01</span>', sub: '' },
        { main: '<span class="font-bold text-gray-900">FREE</span> <span class="font-medium text-gray-800">daily product trainings and support</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Full suite of next-gen investing tools</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Industry first AI powered comp tool</span>', sub: '' },
        { main: '<span class="font-medium text-gray-800">Includes dedicated support agent</span>', sub: '' }
      ]
    }
  ]
})
