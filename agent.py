import subprocess
import json


def run_agent(question):
    process = subprocess.run(
        ["node", "lpi-wrapper.js", question],
        capture_output=True,
        text=True
    )

    if process.stderr:
        print("Error:", process.stderr)

    if not process.stdout.strip():
        raise Exception("No response received from LPI wrapper.")

    return json.loads(process.stdout)


if __name__ == "__main__":
    question = input("Ask your AI strategy question: ")

    print("\n🔎 Querying LPI tools...\n")

    result = run_agent(question)

    print("==============================")
    print("AI STRATEGY RESPONSE")
    print("==============================\n")

    print("User Question:", question)

    # Extract clean text from tool responses
    knowledge_text = result["knowledge"]["result"]["content"][0]["text"]
    cases_text = result["cases"]["result"]["content"][0]["text"]

    print("\n--- Knowledge Insights ---\n")
    print(knowledge_text)

    print("\n--- Relevant Case Studies ---\n")
    print(cases_text)

    print("\n=== SOURCES USED ===")
    print("• query_knowledge")
    print("• get_case_studies")
