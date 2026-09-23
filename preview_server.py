"""Local-only preview, Python 3 standard library. Does not publish anything.

A stable port keeps the browser's local drafts on the same origin between runs.
Use --port to choose a different port intentionally; drafts are per origin.
"""
from argparse import ArgumentParser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser


def main() -> None:
    parser = ArgumentParser(description="Preview the portfolio locally.")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("Port must be between 1 and 65535.")

    root = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        print(f"Could not open port {args.port}: {error}")
        print("Close the previous preview window/server and run this again.")
        print("Or choose another port: python preview_server.py --port 8766")
        print("Changing the port uses a separate browser draft. Import content.json if needed.")
        raise SystemExit(1) from error

    with server:
        url = f"http://127.0.0.1:{server.server_port}/"
        print(f"Portfolio: {url}")
        print(f"Content Studio: {url}studio.html")
        print("Local preview only. Press Ctrl+C to stop.")
        if not args.no_browser:
            timer = threading.Timer(0.4, lambda: webbrowser.open(url))
            timer.daemon = True
            timer.start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nPreview stopped.")


if __name__ == "__main__":
    main()
