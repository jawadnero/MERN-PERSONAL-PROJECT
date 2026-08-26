import React, { useState } from 'react'

const Contect = () => {
	const [submitted, setSubmitted] = useState(false)

	const handleSubmit = (event) => {
		event.preventDefault()
		setSubmitted(true)
	}

	return (
		<main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 20px' }}>
			<h1>Contact Us</h1>
			<p>Have a question about your order? Send us a message and we will get back to you.</p>

			<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
				<label>
					Name
					<input name="name" type="text" required style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px' }} />
				</label>
				<label>
					Email
					<input name="email" type="email" required style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px' }} />
				</label>
				<label>
					Message
					<textarea name="message" required rows="6" style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px' }} />
				</label>
				<button type="submit">Send Message</button>
			</form>

			{submitted && <p role="status">Thanks for reaching out. We received your message.</p>}
		</main>
	)
}

export default Contect
