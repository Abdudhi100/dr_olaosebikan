# V12 browser review

The empty hub passed headless-browser checks at 390, 768, 1440 and 1920 pixels: no horizontal overflow; one H1; correct noindex; real logo load; category anchors; responsive navigation and Escape/focus restoration; reduced motion; existing booking/homepage smoke checks. No appointment was submitted.

`insights-390.png` and `insights-1440.png` show the actual empty hub and were visually inspected against the Figma reference. The empty state replaces design-only placeholder content truthfully.

Populated article, video and news pages passed all four viewport widths with no horizontal overflow or client errors. The video player remains unloaded before visitor action and creates the validated iframe after the load control is pressed.

Synthetic detail screenshots use clearly labelled nonmedical test fixtures. They are review evidence only and are not in the final website export or CMS. Synthetic video thumbnail/player responses are mocked for browser interaction checks; those checks do not verify real provider playback or real captions.
