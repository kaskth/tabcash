export default async function checkArrayObjectsProducts(products) {
    // التحقق من أن المصفوفة ليست فارغة
    if (products.length === 0) {
        return false;
    }

    // التحقق من وجود الخصائص المطلوبة في الكائنات داخل المصفوفة
    for (let i = 0; i < products.length; i++) {
        const obj = products[i];
        if (!obj.hasOwnProperty('name') || !obj.hasOwnProperty('description') || !obj.hasOwnProperty('price') || !obj.hasOwnProperty('quantity') || !obj.hasOwnProperty('link')) {
            return false;
        }
    }

    // إذا تم التحقق من جميع الكائنات وتواجد الخصائص المطلوبة، يعتبر الاختبار صحيحًا
    return true;
}