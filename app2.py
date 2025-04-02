from flask import Flask, request, jsonify
import requests
import json, datetime, os

# Initialize Flask app
app = Flask(__name__)
def load_json(filename):
    file_path = os.path.join("data", filename)  # Ensure files are inside 'data' folder
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return str(json.load(file))
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return {}

# Load all datasets at startup
company_info = load_json("company_info.json")
about_us = load_json("about_us.json")
services = load_json("services.json")
products = load_json("products.json")
career_benefits = load_json("career_benefits.json")
jobs = load_json("jobs.json")

@app.route('/askLlama2', methods=['POST'])
def ask_llama():
    data = request.json
    question = data.get('question', "")
    past_conversations = data.get('conversations', [])

    # Format the past conversations into a JSON array
    print(past_conversations)
    conversation_history = []
    for conv in past_conversations:
        conversation_history.append({
            "role": 'user',
            "message": conv.get('user', '')
        })
        conversation_history.append({
            "role": 'bot',
            "message": conv.get('bot', '')
        })
    if len(conversation_history) >5:
        conversation_history = conversation_history[-5:] 

    context = f"""You are an advanced AI model that extracts entities from user queries. Your task is to analyze the given query and return response in format:
                    {
                      "entities": {
                        "email": "<extracted_email_or_null>",
                        "otp": "<extracted_otp_or_null>",
                        "date": "<extracted_date_or_null>",
                        "time": "<extracted_time_or_null>"
                      }
                    }

                    ### Instructions:
                    1. *Extract the following entities from the query:*
                       - "date" → If the query contains a date. Extract date and convert it to a standard format (dd/mm/yy) 
                            - Today’s date is: {{currentDate}}*. Use this to interpret relative dates correctly. Recognize relative dates like "yesterday", "today", "tomorrow", "next Monday", and convert them to "dd/mm/yyformat (Example: "05/03/25"). If the year is not specified, use the current year by default.
                            - Extract the date if present; otherwise, set "date": null.
                       - "time" → If the query contains a time. Extract time and convert it to a standard format (HH:mm AM/PM)
                            - Example: 10:30 AM
                            - Extract the time if present; otherwise, set "time": null.
                       - "email" → If the query contains an email address. Extract the email address.
                            - Extract the email if present; otherwise, set "email": null.
                       - "otp" → If the query contains an 6 digit otp. Extract the otp.
                            - Extract the otp if present; otherwise, set "otp": null."""
    context = f"""
You are an AI chatbot for https://www.healthcareinformatics.co.in/ , so answer a you are the website. Your task is to:
1. Web-Scrap the website to provide answers to the queery
2. Use the provided conversation history(if any) to maintain context.
3. Identify all intents in the user's query.
4. Extract relevant parameters for each intent (each paramater's value's data type should be string if present else null).
5. Format the response strictly in **JSON**.
Company details:- Address:
Healthcare Informatics [SIGNET]
3RD Floor, Tower A, SIGNET Plaza,
Kunal Cross Roads, Sumant Park, Gotri,
Vadodara, Gujarat 390023
Healthcare Informatics [KVT]
3rd Floor, Kashivishweshwar Tower # 5
Jetalpur Road, Haripura,
Vadodara, Gujarat 390007 

Phone:	+91 93 75 825800
Email:	hi@healthcareinfomatics.co.in

DIGIDMS [USA]
2184 Moris Ave, Union, NJ - 07083 

Phone:	1.908.688.8810
Email:	support@digidms.com
You can use it when user want information

### **Conversation History:**  
The previous conversation is:
{json.dumps(conversation_history, indent=2)}

### **Response Format:**  
Return a JSON object with the following structure:
```json
{{
  "response": "Your response to the user",
  "intents": [
    {{
      "Type": "Intent type:- general-information, login, ticket-creation, ticket-updation, ticket-deletion, ticket-status-check, ticket-options,book-demo",
      "Parameters": {{
        "TicketTitle": "Short title summarizing the issue" or null,
        "TicketDescription": "Detailed issue description" or null,
        "Email": "an email" or null,
        "Otp": "a 6-digit OTP" or null,
        "Name": "a name" or null,
        "TicketId": "a number identifying the ticket" or null (more that one means more than one intents) (dont give random),
        "PrefferedDateTime": "date & time in any format" or null
      }}
    }},
    ...
  ]
}}
The user's query is:
"""
    # try:
        # Make a POST request to the Llama model API
    response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('API_KEY')}",
            },
            data=json.dumps({
                # "model": "meta-llama/llama-3.2-11b-vision-instruct:free",
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {
                        "role": "user",
                        "content": context+question
                    }
                ]
            })
        )
    response_content = response.json()
    print(response_content)
    raw_content = response_content["choices"][0]["message"]["content"]
        # Step 2: Remove the code block markers (` ```json ` and ` ``` `)
    if raw_content.startswith("```json"):
            raw_content = raw_content[7:]  # Remove starting ```json
            if raw_content.endswith("```"):
                raw_content = raw_content[:-3]  # Remove ending ```
                parsed_response = json.loads(raw_content.strip())  # Strip any extra spaces
                print(parsed_response)  # Output the clean JSON response
                return jsonify(parsed_response)
    
    return jsonify(response_content)
    
@app.route('/askLlamaInDetail', methods=['POST'])
def ask_llama3():
    data = request.json
    question = data.get('question', "")
    past_conversations = data.get('conversations', [])

    print(past_conversations)
    conversation_history = []
    for conv in past_conversations:
        conversation_history.append({
            "role": 'user',
            "content": conv.get('user', '')
        })
        conversation_history.append({
            "role": 'assistant',
            "content": conv.get('bot', '')
        })
    if len(conversation_history) >5:
        conversation_history = conversation_history[-5:] 

    try:
        # with open("./healthcare_scraper/cleaned_output1.json", "r", encoding="utf-8") as file:
    #     with open("./structured_healthcare_data.json", "r", encoding="utf-8") as file:
    #         website_data = json.load(file)
    # except FileNotFoundError:
    #     website_data = {}
    # content = str(website_data)
        #   with open("./scraped_data2.json", "r", encoding="utf-8") as file:
        with open("./only_text.json", "r", encoding="utf-8") as file:
        # with open("./cleaned_only_text.json", "r", encoding="utf-8") as file:
            website_data = json.load(file)
    except FileNotFoundError:
        website_data = {}
    content = str(website_data)
    # content = " ".join(value["content"] for value in website_data.values())
    # with open("./only_text.json", "w", encoding="utf-8") as file:
    #     json.dump(content, file, indent=4, ensure_ascii=False)
    current_date = datetime.date.today()
    current_day = str(datetime.date.weekday(current_date))
    current_date = str(current_date)
    current_time = str(datetime.time.hour) + " " + str(datetime.time.min)
    # print(content)
    response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('API_KEY')}"
                # "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",
            },
            data=json.dumps({
                # "model": "meta-llama/llama-3.2-11b-vision-instruct:free",
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {
                        "role": "system",
                        "content": """Your are an advanced chatbot for https://www.healthcareinformatics.co.in/.
                        Instructions:- 
                        1. You are the chatbot deployed on the same website, so answer accrodingly in 1st person.
                        2. Identify all the intents from the query. Intent types will be only from the following:- general-information, login, ticket-creation, ticket-updation, ticket-deletion, ticket-status-check, ticket-options & book-demo.
                        3. Extract relevant parameters for each intent from the query. Provide parameter only if present there, don't provide anything like null, none, "" etc. Parameters will be from following:- 
                         - general-information - null
                         - login - Email
                         - ticket-creation - TicketTitle, TicketDescription
                         - ticket-updation - TicketId, TicketTitle, TicketDescription
                         - ticket-status-check - TicketId(Provide different intents incase of multiple ticketids available)
                         - ticket-deletion - TicketId(Provide different intents incase of multiple ticketids available)
                         - book-demo - Date(Convert any provided date in any formate to dd/mm/yy (IST). Current date: """ + current_date + " " + current_day + """), Time(Convert any provided time to HH:mm AM/PM (IST). Current time: """ + current_time + """)
                         4. Answer the general-information query from the data source - """ + content +"""
                         5. Only provide repsonse in json format as discussed below:-
                         {{
                            "response": "Answer to the query - in case of general-information query",
                            "intents": [
                            {
                                "Type": "",
                                "Parameters": {
                                    "TicketTitle": "",
                                    ...
                                }
                            }
                            ...
                            ]
                         }}
                        """
                    },
                    # *conversation_history,
                    {
                        "role": "user",
                        "content": question
                    }
                ]
            })
        )
    print(response.json())
    answer = response.json()["choices"][0]["message"]["content"]
    print(answer)
    return answer

@app.route('/askLlama', methods=['POST'])
def ask_llama_final():
    data = request.json
    question = data.get('question', "")
    past_conversations = data.get('conversations', [])

    # Format conversation history
    conversation_history = []
    for conv in past_conversations:
        conversation_history.append({"role": 'user', "message": conv.get('user', '')})
        conversation_history.append({"role": 'bot', "message": conv.get('bot', '')})
    
    if len(conversation_history) > 5:
        conversation_history = conversation_history[-5:]

    current_date = datetime.date.today()
    current_day = str(datetime.date.weekday(current_date))
    current_date = str(current_date)
    current_time = str(datetime.time.hour) + " " + str(datetime.time.min)
    # print(*conversation_history)
    try:
        # Make a POST request to Llama API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {os.getenv('API_KEY')}"

            # "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"
            },
            json={
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                             {
                        "role": "system",
                        "content": """Your are an advanced chatbot for https://www.healthcareinformatics.co.in/.
                        Instructions:- 
                        1. You are the chatbot deployed on the same website, so answer accrodingly in 1st person. Use the conversation history provided for context.
                        2. Identify all the intents from the query. Intent types will be only from the following:- general-information, login, ticket-creation, ticket-updation, ticket-deletion, ticket-status-check, ticket-options & book-demo.
                        3. Extract relevant parameters for each intent from the query if awailable else give null. Parameters will be from following:- 
                         - general-information - null
                         - login - Email
                         - ticket-creation - TicketTitle, TicketDescription
                         - ticket-updation - TicketId, TicketTitle, TicketDescription
                         - ticket-status-check - TicketId(Provide different intents incase of multiple ticketids available)
                         - ticket-deletion - TicketId(Provide different intents incase of multiple ticketids available)
                         - book-demo - Date(Convert any provided date in any formate to dd/mm/yy (IST). Reference date: """ + current_date + " " + current_day + """), Time(Convert any provided time to HH:mm AM/PM (IST). Reference time: """ + current_time + """)
                         4. Answer the general-information query from the following data sources - 
                         - Company Information: """ + company_info +"""
                         - About the Company: """ + about_us +"""
                         - Services Offered: """+ services +"""
                         - Products & Solutions: """+ products +"""
                         - Career Benefits: """+ career_benefits + """
                         - Available Jobs: """+ jobs + """
                         5. Only provide repsonse in json format as discussed below:-
                         {{
                            "response": "Answer to the query - in case of general-information query",
                            "intents": [
                            {
                                "Type": "",
                                "Parameters": {
                                    "TicketTitle": "",
                                    ...
                                }
                            }
                            ...
                            ]
                         }}
                        """
                    },
                    *conversation_history,
                    {
                        "role": "user",
                        "content": question
                    }
                    
                             ]
            }
        )

        response_content = response.json()
        print(response_content)
        raw_content = response_content["choices"][0]["message"]["content"]

        # Clean JSON response
        if raw_content.startswith("```json"):
            raw_content = raw_content[7:]
        if raw_content.endswith("```"):
            raw_content = raw_content[:-3]

        parsed_response = json.loads(raw_content.strip())
        return jsonify(parsed_response)

    except Exception as e:
        return jsonify({"error": "Failed to process request.", "details": str(e)})


  
# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
