import re

with open("c:/Users/user/Documents/GitHub/megumi_massaje/src/components/InlineBooking.jsx", "r", encoding="utf-8") as f:
    code = f.read()

# Remove state
code = code.replace("    const [step, setStep] = useState(1);\n", "")
code = code.replace("    const handleNext = () => setStep(s => s + 1);\n    const handleBack = () => setStep(s => s - 1);\n\n", "")
code = code.replace("    const handleNext = () => setStep(s => s + 1);\n    const handleBack = () => setStep(s => s - 1);\n", "")

# Remove step indicator
step_indicator_pattern = r"            \{isMobile && \(\n                <div style=\{stepIndicator\}>\n                    \{\[1, 2, 3\]\.map\(i => \(\n                        <div\n                            key=\{i\}\n                            style=\{\{\n                                \.\.\.stepDot,\n                                background: step >= i \? 'var\(--color-accent\)' : 'rgba\(255,255,255,0\.1\)'\n                            \}\}\n                        />\n                    \)\)\}\n                </div>\n            \)\}\n\n"
code = re.sub(step_indicator_pattern, "", code)

# Fix true && logic
code = code.replace("{(!isMobile || step === 1) && (", "{(true) && (")
code = code.replace("{(!isMobile || step === 2) && (", "{(true) && (")
code = code.replace("{(!isMobile || step === 3) && (", "{(true) && (")

# Remove mobile 'Next' button panel 1
mobile_next_1 = r"                            \{isMobile && \(\n                                <button\n                                    onClick=\{handleNext\}\n                                    disabled=\{\!isStep1Ready\}\n                                    style=\{isStep1Ready \? confirmButton : disabledButton\}\n                                >\n                                    \{t\('Next', \{ en: 'Next', es: 'Siguiente' \}\)\}\n                                </button>\n                            \)\}\n"
code = re.sub(mobile_next_1, "", code)

# Remove mobile 'Next/Back' panel 2
mobile_next_2 = r"                            \{isMobile && \(\n                                <div style=\{\{ display: 'flex', gap: '1rem', flexDirection: 'column' \}\}>\n                                    <button\n                                        onClick=\{handleNext\}\n                                        disabled=\{\!isStep2Ready\}\n                                        style=\{isStep2Ready \? confirmButton : disabledButton\}\n                                    >\n                                        \{t\('Next', \{ en: 'Next', es: 'Siguiente' \}\)\}\n                                    </button>\n                                    <button onClick=\{handleBack\} style=\{cancelButton\}>\{t\('Back', \{ en: 'Back', es: 'Atrás' \}\)\}</button>\n                                </div>\n                            \)\}\n"
code = re.sub(mobile_next_2, "", code)

# Replace actions in panel 3
actions_3_old = """                            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                {isMobile && <button onClick={handleBack} style={cancelButton}>{t('Back', { en: 'Back', es: 'Atrás' })}</button>}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isReady}
                                    style={isReady ? confirmButton : disabledButton}
                                >
                                    {t('Book Now')}
                                </button>
                            </div>"""
                            
actions_3_new = """                            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isReady}
                                    style={isReady ? confirmButton : disabledButton}
                                >
                                    {t('Book Now')}
                                </button>
                            </div>"""

code = code.replace(actions_3_old, actions_3_new)

with open("c:/Users/user/Documents/GitHub/megumi_massaje/src/components/InlineBooking.jsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated InlineBooking.jsx")
