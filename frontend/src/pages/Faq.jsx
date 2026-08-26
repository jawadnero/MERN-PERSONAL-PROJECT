import React from 'react'

const frequentlyAskedQuestions = [
	{
		question: 'How can I place an order?',
		answer: 'Browse the shop, add the products you want to your cart, and continue to checkout to complete your order.'
	},
	{
		question: 'What payment methods do you accept?',
		answer: 'You can pay securely through the payment options shown during checkout.'
	},
	{
		question: 'How long does delivery take?',
		answer: 'Most orders arrive within 3 to 7 business days. Delivery times may vary depending on your location.'
	},
	{
		question: 'Can I return an item?',
		answer: 'Please contact our support team with your order details so we can help you with the return process.'
	},
	{
		question: 'How do I contact support?',
		answer: 'Use our contact page to send us a message. Include your order number when asking about an existing order.'
	}
]

const Faq = () => {
	return (
		<main style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px' }}>
			<header style={{ marginBottom: '28px', textAlign: 'center' }}>
				<h1>Frequently Asked Questions</h1>
				<p>Find quick answers about orders, payments, delivery, and returns.</p>
			</header>

			<section aria-label="Frequently asked questions" style={{ display: 'grid', gap: '12px' }}>
				{frequentlyAskedQuestions.map(({ question, answer }) => (
					<details key={question} style={{ padding: '18px 20px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}>
						<summary style={{ cursor: 'pointer', fontWeight: 600 }}>{question}</summary>
						<p style={{ marginTop: '14px', color: '#a1a1aa', lineHeight: 1.6 }}>{answer}</p>
					</details>
				))}
			</section>
		</main>
	)
}

export default Faq
