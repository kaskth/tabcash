import admin from 'firebase-admin'



admin.initializeApp({
    credential: {
        "type": "service_account",
        "project_id": "tabcash-18f8b",
        "private_key_id": "9c4a9066e5ed45dd424ca400caa81a3d11f55ce3",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqTctxIkbYk39u\nYRW1jA3l1je73LFX//rbgVlMY5DXirrpvcSumXXV1B7tKkQ8EOoRwCN4lMfx80Ag\nIeOh5YZc1/wV+rCR+QYO/xVu18NLPz63Ey7aEzI0V2n+qW1RXZMpSq7KU6MwFryy\nJmhdkPKTezFGFjwOurVfX23UaYnvpT4aMDepoiA2ziY2zrg87dAIcJ8Dcv1S7awv\nvfZ4e6bIuC2lakLgf2ln2FvZ5GVVV2LbXv264Df8dAESkateB0hMBAFoaaHhwmy2\nM3/1ssAnm83nJGiswGO8l93NSnQhdT9W1i9EvxXrApvy24kEjlHeNO9lxvCjn1hs\nj+7sRLSlAgMBAAECgf8FcTWfdYaSI9hDE4AC3Yn2MxCU4qxQUeX73GT1+Obbxf1e\nsU0B8DczGKdL1yD/8IT8v/jPJbuKPnTxjHrXtFUnNXN5gbIzI45XikyJzpc7VczJ\nOH9Jg6U6eVot3Dwyaw8wVa0v6rLG3s0Cw7oqlPyoxMGamblBQfeJ0Jti6j3YELw3\nurIwgqHffApM/xvySi8FvOPlHz6PoV1ez/duHY/hkZPQK9CaF3FAQUOdMhPTLg+h\nT+kIGhhFCtc5HvAvrqf+NVQ+NvpB1rJDZhrquI1l5Cnbbm7pKqATdmzayWJirv6Q\nGPMMsjKJiA8/uniaq0aixesY8sZibdXMsi50ZqsCgYEA5yzkPIbpLBCm2scXv3V8\nY1Z8ovbKrqZmSb5SDtQ3Ff0I/vKJyLKG7pUQRNdlnaCrEI4Zqvq7flLSBVFm4Orf\nBvLctytCVo/OVGLNsNtWNhnd6JH7fe4EQM8Xu5Jg4pdTQmUKL8kA7JMx2pw4UPq/\nDcUd0sAG/oLh98ZB64lHSoMCgYEAvJeFRpUbveCVNDGk0UjGPKRt5ZUYdeK3parM\nOUUn2SQj/yFHVQFLUSTTRLjaU+E3tnTb3Hcwah8urIocFmUROIkAlP/cJZT1N2y3\nKMKXwpZUxZcZ1mIQOqGDF03qad07DYi4+I0pSFNQ44HkPUcBSoloTvh8XY80Vyon\n/VbA+7cCgYA0hP1hRuEocqwFnh+mDqHwy5BLUbggT4uDi2qHFe1h4HevvBhTcUO4\nZkMo8KqUUhErFK1+K7J284flT2YJCTMcGAbO0lQi6E7e2weR+3KtndjNYoT5Sh7L\nPoFMyueZ8vkmZ2AWFRtRo+s6mC0vMJhBH5wz6g5suf1uVitZwHli0wKBgQCw38be\naNAo5+3nkrvKkN9jVq+/R3M2dNjaZnK9L6/sximAiZyWC+2wf8IpTNlvG+YdmEHv\n5lUg4nfq2Gj5U/avuEY0eDbnhGnrfmnVr5OXq1h8LHfOChDAfGQvQiMdAKD204jv\ni6zxKTrO9S6zjdmXJ4INtp0lPj7PlTkGMAw0xwKBgQC0DgXGhPrZ1vbvkyQPUiwx\ntgrufvx0/ZHGmc6SLFg7vuS9Sx7f2kgIxct/cK3O/IQ+8OXT+FHdPisNxyTD5Ll7\nI5i5GlEBWETZs/X9GRBx8UZf2sCaMNQDi2CKWO8OgbnVkRI/8N9kgNUFCCoV3QKC\n9A0OcvZfiQMxCq6RxLTTqQ==\n-----END PRIVATE KEY-----\n",
        "client_email": "tabcath@tabcash-18f8b.iam.gserviceaccount.com",
        "client_id": "107028947045526065894",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/tabcath%40tabcash-18f8b.iam.gserviceaccount.com"
    }
})

const phoneNumber = '+201153300178';
admin.auth().createUser({
    phoneNumber: phoneNumber
})
    .then((userRecord) => {
        const uid = userRecord.uid;
        const verificationCode = generateVerificationCode(); // تعيين رمز التحقق المولد عشوائيا
        const message = `Your verification code is ${verificationCode}`;

        // إرسال رسالة SMS باستخدام Firebase
        admin.messaging().send({
            token: uid,
            notification: {
                title: 'Verification code',
                body: message
            }
        })})
