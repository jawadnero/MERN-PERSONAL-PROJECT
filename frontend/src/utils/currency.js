export const formatPrice = (value) => {
    const amount = Number(value)

    if (!Number.isFinite(amount)) {
        return 'PKR 0'
    }

    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
    }).format(amount)
}
