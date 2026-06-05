<!-- Google Translate API Widget Integration -->
<style>
    /* Hide the google translate top bar banner and logo branding */
    iframe.goog-te-banner-frame {
        display: none !important;
    }
    body {
        top: 0px !important;
    }
    .goog-logo-link {
        display: none !important;
    }
    .goog-te-gadget {
        color: transparent !important;
        font-size: 0px !important;
    }
    .goog-te-gadget span {
        display: none !important;
    }
    .goog-te-combo {
        display: none !important;
    }
    #goog-gt-tt {
        display: none !important;
    }
    .goog-text-highlight {
        background-color: transparent !important;
        box-shadow: none !important;
    }
</style>

<div id="google_translate_element" style="position: absolute; opacity: 0; width: 0; height: 0; overflow: hidden; pointer-events: none;"></div>

<script type="text/javascript">
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    }

    function setLanguage(langCode) {
        localStorage.setItem('selected_language', langCode);
        
        // Clear any old/conflicting google translate cookies
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=127.0.0.1";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
        
        // Set new cookies
        if (langCode !== 'en') {
            document.cookie = "googtrans=/en/" + langCode + "; path=/;";
            document.cookie = "googtrans=/en/" + langCode + "; path=/; domain=127.0.0.1";
            document.cookie = "googtrans=/en/" + langCode + "; path=/; domain=localhost";
        }
        
        // Reload to apply translation immediately
        window.location.reload();
    }

    // Auto-ensure translate cookie state on load
    document.addEventListener('DOMContentLoaded', () => {
        const savedLang = localStorage.getItem('selected_language');
        if (savedLang && savedLang !== 'en') {
            const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('googtrans='));
            if (!hasCookie) {
                document.cookie = "googtrans=/en/" + savedLang + "; path=/;";
                document.cookie = "googtrans=/en/" + savedLang + "; path=/; domain=127.0.0.1";
                document.cookie = "googtrans=/en/" + savedLang + "; path=/; domain=localhost";
                window.location.reload();
            }
        }
    });
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
