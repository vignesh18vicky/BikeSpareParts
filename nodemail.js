
document.getElementById('btn').addEventListener('click', function (e) {
    e.preventDefault();

    let orderItems = [];
    let totalPrice = 0;

    document.querySelectorAll('#checkoutItems li').forEach((item) => {
        const itemText = item.querySelector('span').innerText;
        const match = itemText.match(/(.+) - ₹ ([0-9.]+) \(Qty: (\d+)\)/);

        if (match) {
            const name = match[1].trim();
            const total = parseFloat(match[2]);
            const quantity = parseInt(match[3]);
            const price = total / quantity;
            const totalItemPrice = price * quantity;

            orderItems.push({
                name: name,
                units: quantity,
                price: totalItemPrice.toFixed(2),
            });
            totalPrice += totalItemPrice;
        }
    });

    if (orderItems.length === 0) {
        toast({
            title: "No Items Found",
            type: "warning",
            duration: 5000
        });

        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        return; // Prevent sending email if there are no items.
    } else {
        const shipping = "Free";
        const tax = "0.00";
        const totalFormatted = totalPrice.toFixed(2);
        const order_id = Math.floor(Math.random() * 1000000); // Random order ID

        const userData = JSON.parse(localStorage.getItem("loggedInUser"));

        const customerName = userData.username;
        const customerEmail = userData.email;

        // Format the order details nicely

        const orderDetails = `
Order Receipt🧾
--------------------------------------------
Order ID : ${order_id}
Name     : ${customerName}
--------------------------------------------
Items📦
${orderItems.map(item => `\t➡️ ${item.name} (₹ ${(Number(item.price) / Number(item.units)).toFixed(2)}) — Qty: ${item.units} — ₹ ${item.price}`).join('\n')}
--------------------------------------------
Shipping🚚    : ${shipping}
Tax🧮             : ₹ ${tax} 
Total Price💵 : ₹ ${totalFormatted}
--------------------------------------------
🎉 Thank you for your order! 🎉
`;


        const data = {
            name: customerName,
            email: customerEmail,
            orderDetails: orderDetails
        };

        // Send the data to your Node.js server
        fetch("http://localhost:3000/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    toast({
                        title: "Email sent successfully!!",
                        type: "success",
                        duration: 5000
                    });
                } else {
                    toast({
                        title: "Failed to send email.",
                        type: "error",
                        duration: 5000
                    });
                }
            })
            .catch(error => {
                console.error("Error sending email:", error);
                toast({
                    title: "Failed to send email.",
                    type: "error",
                    duration: 5000
                });
            });

        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
});



