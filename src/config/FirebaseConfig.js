const CONFIG_KEYS = {
    DEV: 'AIzaSyBdMNvbNTi8fjy90z-3Scb-MzMJqrOzD0I',
    TEST: 'AIzaSyD54aZO3LIPagcU1L-c8RgUUDukJ6Ca7Ro',
    STAGING: 'AIzaSyDYoIFk9a_ERsrkDQSEaqgauvETS0mzXUM',
    PRODUCTION: 'AIzaSyBZdsQ91kYtL2CHv_lTFfgzGnSrXs3GDPg',
};

export const firebaseConfig = {
    dev: {
    apiKey: CONFIG_KEYS.DEV,
    authDomain: 'fir-cloud-messaging-a0711.firebaseapp.com',
    projectId: 'fir-cloud-messaging-a0711',
    storageBucket: 'fir-cloud-messaging-a0711.appspot.com',
    messagingSenderId: '909392288554',
    appId: '1:909392288554:web:66fd30c86a9f4b39919c53',
    measurementId: 'G-GED9T6VLT6',
    },
    devVapid: 'BDlpm7WXmm2aCrABocabOM_h4H8WQ4uEEdZ7CixKH9m42f-HcEfkY1ApfpBGTwtZQgkaQ7QH7X4Nv5WqEN520is',
    test: {
    apiKey: CONFIG_KEYS.TEST,
    authDomain: 'wh-test-fcm.firebaseapp.com',
    projectId: 'wh-test-fcm',
    storageBucket: 'wh-test-fcm.appspot.com',
    messagingSenderId: '805872239626',
    appId: '1:805872239626:web:c79db45b1ca5622a89cbf3',
    },
    testVapid: 'BK76FOIRoeOoOemc7V8qSzp3b8JzNyefg7GV4iDmUsNMU4PumzWjhX6b6ziRNUYZtpHnqw4ZlpAVJ-VwpgePs2M',
    staging: {
    apiKey: CONFIG_KEYS.STAGING,
    authDomain: 'wh-staging-fcm.firebaseapp.com',
    projectId: 'wh-staging-fcm',
    storageBucket: 'wh-staging-fcm.appspot.com',
    messagingSenderId: '59198287640',
    appId: '1:59198287640:web:10752a7cb6bf344f4af86d',
    },
    stagingVapid: 'BA8blS4xUxS3Zi4HDU_yNjYFQOcy5XBdOQeBfOKN6mhAfGF7yAAyMgL0Ky0MS8PEzYdDCN1Ziv6PeOFjRPoQ6qk',
    production: {
        apiKey: CONFIG_KEYS.PRODUCTION,
        authDomain: 'prod-fcm-notification.firebaseapp.com',
        projectId: 'prod-fcm-notification',
        storageBucket: 'prod-fcm-notification.appspot.com',
        messagingSenderId: '205328466034',
        appId: '1:205328466034:web:680b70b2485ca6a2f702eb',
    },
    productionVapid: 'BLgQEFTvOFPUJO0XKwJzFHLafhPYrDeb7WvNqqnxYCLmDr_2-tEBwJVtCwdIMBqwXfGQE-Y7Bm9ur5PEiAYEFFU',
};

export default firebaseConfig;
