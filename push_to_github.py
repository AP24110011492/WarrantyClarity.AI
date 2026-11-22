import sys
import os
import getpass
from dulwich import porcelain
from dulwich.client import HTTPUnauthorized

def push():
    repo_path = os.path.dirname(os.path.abspath(__file__))
    remote_url = "https://github.com/AP24110011492/WarrantyClarity.AI.git"

    # Get token from argv, env, or interactive input
    token = None
    if len(sys.argv) > 1 and sys.argv[1].strip():
        token = sys.argv[1].strip()
    elif os.environ.get("GITHUB_TOKEN"):
        token = os.environ.get("GITHUB_TOKEN").strip()
    else:
        print("=" * 60)
        print("  WarrantyClarity AI - Push to GitHub")
        print("  Target: " + remote_url)
        print("=" * 60)
        print("\nTo push to GitHub, a Personal Access Token (PAT) is required.")
        print("Create one at: https://github.com/settings/tokens (classic with 'repo' scope)")
        print()
        try:
            token = getpass.getpass("Enter your GitHub Personal Access Token (PAT): ").strip()
        except Exception:
            token = input("Enter your GitHub Personal Access Token (PAT): ").strip()

    if not token:
        print("Error: No GitHub token provided. Push aborted.")
        sys.exit(1)

    # Inject token into HTTPS URL for authenticated push
    auth_remote_url = f"https://AP24110011492:{token}@github.com/AP24110011492/WarrantyClarity.AI.git"

    print(f"\nPushing 'main' branch to {remote_url} ...")
    try:
        porcelain.push(
            repo_path,
            auth_remote_url,
            refspecs=[b"refs/heads/main:refs/heads/main"]
        )
        print("\n SUCCESS! All files have been successfully pushed to:")
        print(" https://github.com/AP24110011492/WarrantyClarity.AI")
    except HTTPUnauthorized:
        print("\n Authentication failed: Invalid token or insufficient permissions.")
        print(" Please verify that your token has the 'repo' scope enabled.")
        sys.exit(1)
    except Exception as e:
        print(f"\n Push failed: {type(e).__name__} - {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    push()
