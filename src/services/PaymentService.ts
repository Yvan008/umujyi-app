export class PaymentService {
  static async checkout(payload: any) {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to process checkout");
    }
    return res.json();
  }

  static async verifyPayment(paymentId: string) {
    const res = await fetch(`/api/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to verify payment");
    }
    return res.json();
  }
}
