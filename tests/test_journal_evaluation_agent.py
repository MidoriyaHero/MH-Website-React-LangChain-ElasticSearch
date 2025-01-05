import pandas as pd
import pytest
from app.agent.journal_evaluation_agent import JournalEvaluationAgent
from langchain_openai import ChatOpenAI
from app.core.config import settings

@pytest.fixture
def test_user():
    return dict(
        user_name="test_user",
        email="test@example.com",
        hash_password="test_password",
        emergency_contact_email="emergency@example.com"
    )

@pytest.fixture
def evaluation_agent():
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
    return JournalEvaluationAgent(llm)

@pytest.mark.asyncio
async def test_evaluate_positive_sentiment(evaluation_agent, test_user):
    # Test case for positive sentiment
    journal_content = """Hôm nay thật tuyệt vời! Tôi đã hoàn thành dự án quan trọng 
    và được sếp khen ngợi. Về nhà, cả gia đình cùng ăn tối và trò chuyện vui vẻ."""
    
    result = await evaluation_agent.evaluate(journal_content, test_user)
    
    assert isinstance(result, dict)
    assert "sentiment" in result
    assert "emotions" in result
    assert "themes" in result
    assert result["sentiment"] == "TÍCH CỰC"
    assert len(result["emotions"]) > 0
    assert len(result["themes"]) > 0

@pytest.mark.asyncio
async def test_evaluate_negative_sentiment(evaluation_agent, test_user):
    # Test case for negative sentiment with severe content
    journal_content = """Dạo này tôi cảm thấy rất mệt mỏi và tuyệt vọng. 
    Tôi không muốn sống nữa, không còn ý nghĩa gì cả."""
    
    result = await evaluation_agent.evaluate(journal_content, test_user)
    
    assert isinstance(result, dict)
    assert result["sentiment"] == "TIÊU CỰC"
    assert "severity_alert" in result
    assert result["severity_alert"] == True
    assert "detected_concerns" in result
    assert "suicide_related" in result["detected_concerns"]

@pytest.mark.asyncio
async def test_evaluate_neutral_sentiment(evaluation_agent, test_user):
    # Test case for neutral sentiment
    journal_content = """Hôm nay là một ngày bình thường. 
    Sáng đi làm, trưa ăn cơm với đồng nghiệp, chiều họp hành, tối về nhà."""
    
    result = await evaluation_agent.evaluate(journal_content, test_user)
    
    assert isinstance(result, dict)
    assert result["sentiment"] == "TRUNG TÍNH"

@pytest.mark.asyncio
async def test_evaluate_error_handling(evaluation_agent, test_user):
    # Test error handling with invalid input
    result = await evaluation_agent.evaluate("", test_user)
    
    assert isinstance(result, dict)
    assert result["sentiment"] == "TRUNG TÍNH"
    assert result["emotions"] == []
    assert result["themes"] == []

@pytest.mark.asyncio
async def test_evaluate_dataset_accuracy(evaluation_agent, test_user):
    # Load your sentiment dataset with explicit encoding
    df = pd.read_csv('/home/tin/Downloads/test.csv', encoding='cp1252')
    
    # Create a mapping dictionary for sentiment labels
    sentiment_mapping = {
        'positive': 'TÍCH CỰC',
        'negative': 'TIÊU CỰC',
        'neutral': 'TRUNG TÍNH'
    }
    
    # Convert the sentiment labels in the dataframe
    df['sentiment'] = df['sentiment'].map(sentiment_mapping)
    
    # Take balanced samples from each class
    samples_per_class = 5  # Adjust this number as needed
    balanced_samples = []
    
    for sentiment in ["TÍCH CỰC", "TIÊU CỰC", "TRUNG TÍNH"]:
        class_samples = df[df['sentiment'] == sentiment].sample(n=samples_per_class, random_state=42)
        balanced_samples.append(class_samples)
    
    # Combine all samples
    df_sample = pd.concat(balanced_samples).sample(frac=1, random_state=42)  # Shuffle the combined samples
    
    # Lists to store predictions and actual values
    predictions = []
    actual_values = []
    texts = []  # Store original texts
    
    # Evaluate each text and collect results
    for _, row in df_sample.iterrows():
        result = await evaluation_agent.evaluate(row['text'], test_user)
        predictions.append(result["sentiment"])
        actual_values.append(row['sentiment'])
        texts.append(row['text'])
    
    # Calculate accuracy
    correct_predictions = sum(1 for pred, actual in zip(predictions, actual_values) if pred == actual)
    total_samples = len(predictions)
    accuracy = correct_predictions / total_samples
    
    print(f"\nOverall Accuracy: {accuracy:.2%}")
    
    # Print wrong predictions
    print("\nWrong Predictions:")
    print("-" * 80)
    for i, (pred, actual, text) in enumerate(zip(predictions, actual_values, texts)):
        if pred != actual:
            print(f"Sample {i + 1}:")
            print(f"Text: {text[:200]}...")  # Print first 200 characters of text
            print(f"Predicted: {pred}")
            print(f"Actual: {actual}")
            print("-" * 80)
    
    # Calculate per-class accuracy
    classes = ["TÍCH CỰC", "TIÊU CỰC", "TRUNG TÍNH"]
    for sentiment_class in classes:
        class_indices = [i for i, x in enumerate(actual_values) if x == sentiment_class]
        if class_indices:
            class_correct = sum(1 for i in class_indices if predictions[i] == actual_values[i])
            class_accuracy = class_correct / len(class_indices)
            print(f"Accuracy for {sentiment_class}: {class_accuracy:.2%}")
            
            # Print wrong predictions for each class
            wrong_predictions = [(i, predictions[i]) for i in class_indices if predictions[i] != actual_values[i]]
            if wrong_predictions:
                print(f"\nWrong predictions for {sentiment_class}:")
                for idx, pred in wrong_predictions:
                    print(f"Text: {texts[idx][:200]}...")
                    print(f"Predicted as: {pred}")
                    print("-" * 40)
    
    # You can set a minimum accuracy threshold
    assert accuracy >= 0.9, f"Model accuracy {accuracy:.2%} is below the minimum threshold of 80%"
