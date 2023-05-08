

export default async function generateCreditCard() {
    const number = generateCreditCardNumber();
    const expiration = generateExpirationDate();
    const cvv = generateCVV();

    return {
        number,
        expiration,
        cvv
    };
}


function generateCreditCardNumber() {
    let number = '';

    for (let i = 0; i < 16; i++) {
        number += Math.floor(Math.random() * 10);
    }

    return number;
}

function generateExpirationDate() {
    const currentYear = new Date().getFullYear();
    const year = currentYear + Math.floor(Math.random() * 6); // يتم توليد تاريخ الانتهاء لمدة 5 سنوات
    const month = Math.floor(Math.random() * 12) + 1; // يتم توليد شهر عشوائي بين 1 و 12

    // يجب أن يكون الشهر بتنسيق MM والسنة بتنسيق YY
    const formattedMonth = String(month).padStart(2, '0');
    const formattedYear = String(year).slice(-2);

    return `${formattedMonth}/${formattedYear}`;
}

function generateCVV() {
    return String(Math.floor(Math.random() * 1000)).padStart(3, '0'); // يتم توليد رقم CVV عشوائي بين 0 و 999 ويجب أن يكون ثلاثة أرقام
}