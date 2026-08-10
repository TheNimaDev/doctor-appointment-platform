const API_BASE_URL = '/api/v1';

const params = new URLSearchParams(window.location.search);

const action = params.get('action');
const token = params.get('token');

const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const errorMessageElement = document.getElementById('errorMessage');

const resetPasswordElement =
    document.getElementById('reset-password');

const verifyEmailElement =
    document.getElementById('verify-email');

const changeEmailElement =
    document.getElementById('change-email');

const resetPasswordForm =
    document.getElementById('resetPasswordForm');

const changeEmailForm =
    document.getElementById('changeEmailForm');

const resetMessage =
    document.getElementById('resetMessage');

const verifyEmailButton =
    document.getElementById('verifyEmailButton');

const verifyMessage =
    document.getElementById('verifyMessage');

const changeEmailMessage =
    document.getElementById('changeEmailMessage');

function showError(message) {
    loadingElement.classList.add('hidden');

    errorMessageElement.textContent = message;

    errorElement.classList.remove('hidden');
}

function showAction(element) {
    loadingElement.classList.add('hidden');

    element.classList.remove('hidden');
}

function setMessage(element, message) {
    element.textContent = message;
}

if (!token) {
    showError('Invalid or missing token.');
} else if (action === 'reset-password') {
    showAction(resetPasswordElement);
} else if (action === 'verify-email') {
    showAction(verifyEmailElement);
} else if (action === 'change-email') {
    showAction(changeEmailElement);
} else {
    showError('Invalid account action.');
}


resetPasswordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword =
        document.getElementById('newPassword').value;

    const confirmPassword =
        document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        setMessage(
            resetMessage,
            'Passwords do not match.',
        );

        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/password/reset`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ?? 'Failed to reset password.',
            );
        }

        setMessage(
            resetMessage,
            'Password reset successfully.',
        );

        resetPasswordForm.reset();

    } catch (error) {
        setMessage(
            resetMessage,
            error instanceof Error
                ? error.message
                : 'Something went wrong.',
        );
    }
});


verifyEmailButton?.addEventListener('click', async () => {
    try {
        verifyEmailButton.disabled = true;

        const response = await fetch(
            `${API_BASE_URL}/auth/verify/email?token=${encodeURIComponent(token)}`,
            {
                method: 'GET',
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ?? 'Failed to verify email.',
            );
        }

        setMessage(
            verifyMessage,
            'Email verified successfully.',
        );

    } catch (error) {
        setMessage(
            verifyMessage,
            error instanceof Error
                ? error.message
                : 'Something went wrong.',
        );

    } finally {
        verifyEmailButton.disabled = false;
    }
});

changeEmailForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newEmail =
        document.getElementById('newEmail').value.trim().toLowerCase();

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/email/change/confirm`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    token,
                    newEmail,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ?? 'Failed to change email.',
            );
        }

        setMessage(
            changeEmailMessage,
            'Email address changed successfully.',
        );

        changeEmailForm.reset();
    } catch (error) {
        setMessage(
            changeEmailMessage,
            error instanceof Error
                ? error.message
                : 'Something went wrong.',
        );
    }
});