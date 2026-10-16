const escapeHtml = (value = "") =>
    String(value).replace(
        /[&<>"']/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[char],
    );

const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatStatus = (status = "") =>
    String(status)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

const COLORS = {
    primary: "#1769aa",
    dark: "#123456",
    light: "#eef6fc",
    border: "#e3eaf1",
    text: "#253449",
    muted: "#6b7b8d",
    success: "#16845b",
    danger: "#c03945",
};

const emailLayout = ({ title, eyebrow, content, footerText }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f2f6fa;font-family:Arial,Helvetica,sans-serif;color:${COLORS.text};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f2f6fa;">
        <tr>
            <td align="center" style="padding:28px 12px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;">
                    <tr>
                        <td style="background:${COLORS.primary};padding:27px 30px;">
                            <p style="margin:0 0 7px;color:#d9edff;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
                                ${escapeHtml(eyebrow)}
                            </p>
                            <h1 style="margin:0;color:#ffffff;font-size:25px;line-height:1.35;">
                                Medical Equipment Store
                            </h1>
                            <p style="margin:8px 0 0;color:#e8f4ff;font-size:13px;">
                                Quality care. Reliable equipment.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px 26px;">
                            ${content}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 26px;background:#f8fafc;border-top:1px solid ${COLORS.border};">
                            <p style="margin:0 0 7px;color:${COLORS.text};font-size:13px;font-weight:bold;">
                                Thank you for choosing us.
                            </p>
                            <p style="margin:0;color:${COLORS.muted};font-size:12px;line-height:1.7;">
                                ${escapeHtml(footerText)}
                            </p>
                            <p style="margin:12px 0 0;color:${COLORS.muted};font-size:11px;">
                                This is an automated email. Please keep it for your records.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

const infoRow = (label, value) => `
<tr>
    <td style="padding:11px 0;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:13px;">
        ${escapeHtml(label)}
    </td>
    <td align="right" style="padding:11px 0;border-bottom:1px solid ${COLORS.border};color:${COLORS.text};font-size:13px;font-weight:bold;">
        ${escapeHtml(value)}
    </td>
</tr>`;

const buildOrderConfirmationEmail = ({
    name,
    orderId,
    items = [],
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    paymentStatus = "pending",
    orderStatus = "placed",
    shippingAddress = {},
}) => {
    const itemRows = items
        .map(
            (item) => `
        <tr>
            <td style="padding:13px 8px;border-bottom:1px solid ${COLORS.border};">
                <div style="font-size:13px;font-weight:bold;color:${COLORS.text};">
                    ${escapeHtml(item.name)}
                </div>
                <div style="margin-top:5px;font-size:12px;color:${COLORS.muted};">
                    Quantity: ${Number(item.quantity) || 0}
                </div>
            </td>
            <td align="right" valign="middle" style="padding:13px 8px;border-bottom:1px solid ${COLORS.border};font-size:13px;font-weight:bold;white-space:nowrap;">
                ${formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 0))}
            </td>
        </tr>`,
        )
        .join("");

    const address = [
        shippingAddress.addressLine,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
    ]
        .filter(Boolean)
        .join(", ");

    const content = `
        <div style="margin-bottom:24px;">
            <div style="width:42px;height:42px;line-height:42px;text-align:center;border-radius:50%;background:#e8f7ef;color:${COLORS.success};font-size:23px;font-weight:bold;">&#10003;</div>
            <h2 style="margin:16px 0 8px;font-size:23px;color:${COLORS.dark};">
                Order confirmed!
            </h2>
            <p style="margin:0;font-size:14px;line-height:1.7;color:${COLORS.muted};">
                Hi ${escapeHtml(name)}, thank you for your order. We have received it and will keep you updated as it progresses.
            </p>
        </div>

        <div style="padding:16px;background:${COLORS.light};border-radius:8px;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:1px;color:${COLORS.muted};text-transform:uppercase;">Order reference</p>
            <p style="margin:0;font-size:16px;font-weight:bold;color:${COLORS.primary};word-break:break-all;">#${escapeHtml(orderId)}</p>
            <p style="margin:10px 0 0;font-size:12px;color:${COLORS.muted};">
                Status: <strong>${escapeHtml(formatStatus(orderStatus))}</strong>
            </p>
        </div>

        <h3 style="margin:0 0 12px;font-size:16px;color:${COLORS.dark};">Order summary</h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            ${itemRows}
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;border-collapse:collapse;">
            ${infoRow("Subtotal", formatCurrency(subtotal))}
            ${infoRow("Shipping", formatCurrency(shippingFee))}
            <tr>
                <td style="padding:16px 0 4px;font-size:15px;font-weight:bold;color:${COLORS.dark};">Total</td>
                <td align="right" style="padding:16px 0 4px;font-size:20px;font-weight:bold;color:${COLORS.primary};">${formatCurrency(total)}</td>
            </tr>
        </table>

        <div style="margin-top:24px;padding:17px;border:1px solid ${COLORS.border};border-radius:8px;">
            <h3 style="margin:0 0 12px;font-size:15px;color:${COLORS.dark};">Delivery details</h3>
            <p style="margin:0 0 7px;font-size:13px;line-height:1.6;"><strong>${escapeHtml(shippingAddress.fullName || name)}</strong></p>
            <p style="margin:0 0 7px;font-size:13px;line-height:1.7;color:${COLORS.muted};">${escapeHtml(address || "Address provided at checkout")}</p>
            <p style="margin:0;font-size:13px;color:${COLORS.muted};">Phone: ${escapeHtml(shippingAddress.phone || "Not provided")}</p>
        </div>

        <div style="margin-top:18px;padding:15px;background:#f8fafc;border-radius:8px;">
            <p style="margin:0 0 7px;font-size:13px;"><strong>Payment method:</strong> ${escapeHtml(formatStatus(paymentMethod))}</p>
            <p style="margin:0;font-size:13px;"><strong>Payment status:</strong> ${escapeHtml(formatStatus(paymentStatus))}</p>
        </div>`;

    return emailLayout({
        title: "Order Confirmation",
        eyebrow: "Order confirmation",
        content,
        footerText:
            "If you have questions about your order, please contact our support team.",
    });
};

const buildOrderStatusEmail = ({
    name,
    orderId,
    previousStatus,
    orderStatus,
}) => {
    const current = formatStatus(orderStatus);
    const isDelivered = orderStatus === "delivered";
    const isCancelled = orderStatus === "cancelled";
    const isShipped = orderStatus === "shipped";

    const message = isCancelled
        ? "Your order has been cancelled. If you have questions, please contact our support team."
        : isDelivered
          ? "Your order has been marked as delivered. We hope everything meets your expectations."
          : isShipped
            ? "Your order has been shipped and is on its way."
            : "There is an update to your order. You can find the latest status below.";

    const badgeColor = isCancelled ? COLORS.danger : COLORS.primary;

    const content = `
        <h2 style="margin:0 0 10px;font-size:23px;color:${COLORS.dark};">
            Order status update
        </h2>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:${COLORS.muted};">
            Hi ${escapeHtml(name)}, ${escapeHtml(message)}
        </p>

        <div style="padding:19px;background:${COLORS.light};border-radius:8px;margin-bottom:22px;">
            <p style="margin:0 0 7px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${COLORS.muted};">Order reference</p>
            <p style="margin:0;font-size:16px;font-weight:bold;color:${COLORS.primary};word-break:break-all;">#${escapeHtml(orderId)}</p>
            <div style="margin-top:16px;">
                <span style="display:inline-block;padding:8px 13px;border-radius:20px;background:${badgeColor};color:#ffffff;font-size:12px;font-weight:bold;">
                    ${escapeHtml(current)}
                </span>
            </div>
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            ${infoRow("Previous status", formatStatus(previousStatus))}
            ${infoRow("Current status", current)}
        </table>

        <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:${COLORS.muted};">
            Thank you for shopping with Medical Equipment Store.
        </p>`;

    return emailLayout({
        title: "Order Status Update",
        eyebrow: "Order update",
        content,
        footerText: "Keep this email as a reference for your order status.",
    });
};

const buildOrderCancellationEmail = ({ name, orderId }) => {
    const content = `
        <div style="width:42px;height:42px;line-height:42px;text-align:center;border-radius:50%;background:#fff0f0;color:${COLORS.danger};font-size:23px;font-weight:bold;">&times;</div>
        <h2 style="margin:16px 0 10px;font-size:23px;color:${COLORS.dark};">Order cancelled</h2>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:${COLORS.muted};">
            Hi ${escapeHtml(name)}, your order has been cancelled as requested.
        </p>

        <div style="padding:18px;background:${COLORS.light};border-radius:8px;">
            <p style="margin:0 0 7px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${COLORS.muted};">Cancelled order</p>
            <p style="margin:0;font-size:16px;font-weight:bold;color:${COLORS.primary};word-break:break-all;">#${escapeHtml(orderId)}</p>
            <p style="margin:12px 0 0;font-size:13px;color:${COLORS.danger};font-weight:bold;">Status: Cancelled</p>
        </div>

        <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:${COLORS.muted};">
            If you believe this cancellation was made in error or need assistance, please contact our support team.
        </p>`;

    return emailLayout({
        title: "Order Cancellation",
        eyebrow: "Order update",
        content,
        footerText: "We're here to help if you have any questions.",
    });
};

module.exports = {
    buildOrderConfirmationEmail,
    buildOrderStatusEmail,
    buildOrderCancellationEmail,
};
