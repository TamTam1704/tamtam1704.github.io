"""Optional local preview server. Python 3; standard library only.
Binds only to 127.0.0.1. Does not upload or publish any file.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


def main() -> None:
    root = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        url = f"http://127.0.0.1:{server.server_port}/"
        print(f"Portfolio: {url}")
        print(f"Content Studio: {url}studio.html")
        print("Local preview only. Press Ctrl+C to stop.")
        timer = threading.Timer(0.4, lambda: webbrowser.open(url))
        timer.daemon = True
        timer.start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nPreview stopped.")


if __name__ == "__main__":
    main()
