import re
from pathlib import Path

base_dir = Path(__file__).resolve().parent

with open(base_dir / "style.css", "r", encoding="utf-8") as f:
    css = f.read()

with open(base_dir / "audio.js", "r", encoding="utf-8") as f:
    audio = f.read()

with open(base_dir / "game.js", "r", encoding="utf-8") as f:
    game = f.read()

with open(base_dir / "index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. CSS 인라인 치환
html, css_count = re.subn(r'<link[^>]*href=["\']style\.css[^"\'\s]*["\'][^>]*>', lambda m: f'<style>\n{css}\n</style>', html)

# 2. JS 인라인 치환
script_pattern = r'<script[^>]*src=["\']audio\.js[^"\'\s]*["\'][^>]*><\/script>\s*<script[^>]*src=["\']game\.js[^"\'\s]*["\'][^>]*><\/script>'
js_bundle = f'<script>\n{audio}\n\n{game}\n</script>'
html, count = re.subn(script_pattern, lambda m: js_bundle, html)
if css_count != 1 or count != 1:
    raise RuntimeError("CSS 또는 JavaScript 태그를 찾지 못했습니다. index.html을 확인하세요.")

# 단일 파일에서는 웹 설치 기능과 외부 파일 참조가 동작하지 않는다.
html = re.sub(r'<link[^>]+(?:rel="manifest"|rel="icon"|rel="apple-touch-icon")[^>]*>\s*', '', html)
html = re.sub(r'\s*<div id="pwa-install-banner".*?\n    </div>', '', html, count=1, flags=re.S)
html = re.sub(r'\s*<div class="store-install-card">.*?\n        </div>', '', html, count=1, flags=re.S)

output_path = base_dir / "독립실행_kids_math_game.html"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print("치환된 스크립트 태그 수:", count)
print("단일 파일 생성 완료! 크기:", output_path.stat().st_size, "바이트")
