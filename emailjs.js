import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm';

emailjs.init('52BOFZv0j_jSzndOl')

document.getElementById('btn').addEventListener('click', () => {
    sendEmail();
});

function sendEmail() {
    let orderItems = [];
    let totalPrice = 0;

    document.querySelectorAll('#checkoutItems li').forEach((item) => {
        const itemText = item.querySelector('span').innerText;
        const match = itemText.match(/(.+) - Rs ([0-9.]+) \(Qty: (\d+)\)/);

        if (match) {
            const name = match[1].trim();      // Product Name
            const price = parseFloat(match[2]); // Product Price
            const quantity = parseInt(match[3]); // Quantity
            const totalItemPrice = price * quantity; // Total price

            orderItems.push({
                name: name,
                units: quantity,
                price: totalItemPrice.toFixed(2),
            });

            totalPrice += totalItemPrice;
        }
    });

    const shipping = "Free";
    const tax = "0.00";
    const totalFormatted = totalPrice.toFixed(2);
    const order_id = Math.floor(Math.random() * 1000000); // Random order ID
    const email = "nesikavadivel@gmail.com";
    // send  EmailJS
    emailjs.send("service_xtju5yd", "template_p2emjrl", {
        order_id: order_id,
        orders: orderItems,
        email: email,
        cost: {
            shipping: shipping,
            tax: tax,
            total: totalFormatted
        }
    }).then(function (response) {
        console.log('SUCCESS!', response.status, response.text);
    }, function (error) {
        console.log('FAILED...', error);
    });
}
