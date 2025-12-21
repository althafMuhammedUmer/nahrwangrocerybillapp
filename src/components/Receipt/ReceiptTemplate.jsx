import { forwardRef } from 'react'
import './Receipt.css'

export const ReceiptTemplate = forwardRef(({ cart, total, vat, date, invoiceId }, ref) => {
    return (
        <div ref={ref} className="receipt-container">
            <div className="receipt-header">
                <h2>AL NAHRAWAN GROCERY</h2>
                <p>Dubai, UAE</p>
                <p>TRN: 100211383300003</p>
                <h3>+971581156118</h3>
                <p>TEL:- 042722718</p>
            </div>

            <div className="receipt-meta">
                <span>Inv: {invoiceId || '---'}</span>
                <span>{date}</span>
            </div>

            <div className="receipt-items">
                {cart.map((item, i) => (
                    <div key={i} className="item-row">
                        <div className="item-name">{item.name} {item.variant && `(${item.variant})`}</div>
                        <div className="item-details">
                            <span>{item.quantity} x {item.price.toFixed(2)}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="receipt-summary">
                <div className="row">
                    <span>Subtotal:</span>
                    <span>AED {(total - vat).toFixed(2)}</span>
                </div>
                <div className="row">
                    <span>VAT (5%):</span>
                    <span>AED {vat.toFixed(2)}</span>
                </div>
                <div className="row total">
                    <span>Total (Inc. VAT):</span>
                    <span>AED {total.toFixed(2)}</span>
                </div>
            </div>

            <div className="receipt-footer">
                <p>Thank you for shopping!</p>
            </div>
        </div>
    )
})
