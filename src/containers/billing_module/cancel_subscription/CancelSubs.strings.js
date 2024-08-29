export const CANCEL_REASONS = [
    {
        REASON: 'I don’t need a BPM software anymore',
        NOTE: 'Have you tried contacting our team to see if we can help build the features you need? You are important to us, and your requests are our priority.',
        TYPE: 1,
        QUESTIONS: [{ query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    }, {
        REASON: 'Workhall is too expensive',
        NOTE: 'Have you tried contacting our team to see if we can help build the features you need? You are important to us, and your requests are our priority.',
        TYPE: 2,
        QUESTIONS: [{ query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    }, {
        REASON: 'Workhall is too hard to use',
        NOTE: 'Have you tried contacting our team to see if we can help build the features you need? You are important to us, and your requests are our priority.',
        TYPE: 3,
        QUESTIONS: [{ query: 'What part of Workhall is hard to use?', placeholder: 'Type your feedback here….' }, { query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    }, {
        REASON: 'Workhall doesn’t have the features I need',
        NOTE: 'Have you tried contacting our team to see if we can help build the features you need? You are important to us, and your requests are our priority.',
        TYPE: 4,
        QUESTIONS: [{ query: 'What features would you like to see in Workhall?', placeholder: 'Type your suggestions here….' }, { query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    }, {
        REASON: 'I don’t like the customer-service',
        NOTE: 'Have you talked to our customer team about this? They will be sure to help you out. ',
        TYPE: 5,
        QUESTIONS: [{ query: 'Please tell us how we can make the customer-service better', placeholder: 'Type your feedback here….' }, { query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    }, {
        REASON: 'I have found a different service that I like better',
        DISABLE_NOTE: true,
        TYPE: 6,
        QUESTIONS: [{ query: 'Could you please tell us what is missing in Workhall when compared to the other service?', placeholder: 'Type your suggestions here….' }, { query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    }, {
        REASON: 'Other',
        NOTE: 'Have you talked to our customer team about this? They will be sure to help you out. ',
        TYPE: 7,
        QUESTIONS: [{ query: 'What can we do better?', placeholder: 'Type your suggestions here….' }, { query: 'How was your experience with Workhall?', placeholder: 'Type your experience here….' }, { query: 'What can we do better?', placeholder: 'Type your suggestions here….' }],
    },
];

export const CANCEL_COMMON = {
    ASTERISK: '*',
    CANCEL_SUB_HEADING: 'Cancel Subscription',
    CANCEL_SUB_SUBTITLE: 'We’d hate to see you go. But if you could just tell us a few things before you leave...',
    CANCEL_REASON_TELL: 'Please tell us why you wish to leave Workhall',
    KEEP_MY_ACCOUNT: 'Keep My Account',
    NEXT: 'Next', // cancel subscription not yet implemented
    HAVE_YOU_TRIED: 'Have you tried contacting our team to see if we can help build the features you need? You are important to us, and your requests are our priority.',
    CONTACT_TEAM: 'Contact Team',
    CANCEL_REASON_PAGE: 'Reason',
    CANCEL_QUESTION_PAGE: 'QuesPage',
    CANCEL_THANKS_PAGE: 'ThanksPage',
    CANCEL_QUERY: 'ANSWER',
    CANCEL_QUESTION: 'query',
    CANCEL_PH: 'placeholder',
    WE_UNDERSTAND: 'We understand.',
    FEEDBACK: 'Before you go, could you please provide us your feedback so we could serve you better the next time?',
    KEEP_ACCOUNT: 'KEEP MY ACCOUNT',
    CANCEL_SUBSCRIPTION: 'CANCEL SUBSCRIPTION',
    THANKYOU: 'Thank you!',
    CANCEL_THANK_HEADING: 'It will be very sad to see you go.',
    SUBHEADING_ONE: 'Wishing you all the best for all your future projects from the Workhall family.',
    SUBHEADING_TWO: 'In case you ever want to join us back, you can revive your account up to x days',
    EXIT: 'EXIT',
    REVIEW: 'REVIVE ACCOUNT',
};
