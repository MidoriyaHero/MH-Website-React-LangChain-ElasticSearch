import pandas as pd
import pytest
from app.agent.journal_evaluation_agent import JournalEvaluationAgent
from langchain_openai import ChatOpenAI
import os
from app.core.config import settings

@pytest.fixture
def evaluation_agent():
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
    return JournalEvaluationAgent(llm)

@pytest.mark.asyncio
async def test_evaluate_positive_sentiment(evaluation_agent):
    # Test case for positive sentiment
    journal_content = """Hôm nay thật tuyệt vời! Tôi đã hoàn thành dự án quan trọng 
    và được sếp khen ngợi. Về nhà, cả gia đình cùng ăn tối và trò chuyện vui vẻ."""
    
    result = await evaluation_agent.evaluate(journal_content)
    
    assert isinstance(result, dict)
    assert "sentiment" in result
    assert "emotions" in result
    assert "themes" in result
    assert result["sentiment"] == "TÍCH CỰC"
    assert len(result["emotions"]) > 0
    assert len(result["themes"]) > 0

@pytest.mark.asyncio
async def test_evaluate_negative_sentiment(evaluation_agent):
    # Test case for negative sentiment
    journal_content = """Dạo này tôi cảm thấy rất mệt mỏi và căng thẳng. 
    Công việc ngày càng nhiều, deadline dồn dập."""
    
    result = await evaluation_agent.evaluate(journal_content)
    
    assert isinstance(result, dict)
    assert result["sentiment"] == "TIÊU CỰC"
    assert any("mệt mỏi" in emotion or "căng thẳng" in emotion for emotion in result["emotions"])

@pytest.mark.asyncio
async def test_evaluate_neutral_sentiment(evaluation_agent):
    # Test case for neutral sentiment
    journal_content = """Hôm nay là một ngày bình thường. 
    Sáng đi làm, trưa ăn cơm với đồng nghiệp, chiều họp hành, tối về nhà."""
    
    result = await evaluation_agent.evaluate(journal_content)
    
    assert isinstance(result, dict)
    assert result["sentiment"] == "TRUNG TÍNH"

@pytest.mark.asyncio
async def test_evaluate_error_handling(evaluation_agent):
    # Test error handling with invalid input
    result = await evaluation_agent.evaluate("")
    
    assert isinstance(result, dict)
    assert result["sentiment"] == "TRUNG TÍNH"
    assert result["emotions"] == []
    assert result["themes"] == []


@pytest.mark.asyncio
async def test_evaluate_dataset_accuracy(evaluation_agent):
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
    
    # Evaluate each text and collect results
    for _, row in df_sample.iterrows():
        result = await evaluation_agent.evaluate(row['text'])
        predictions.append(result["sentiment"])
        actual_values.append(row['sentiment'])
    
    # Calculate accuracy
    correct_predictions = sum(1 for pred, actual in zip(predictions, actual_values) if pred == actual)
    total_samples = len(predictions)
    accuracy = correct_predictions / total_samples
    
    print(f"\nOverall Accuracy: {accuracy:.2%}")
    
    # Calculate per-class accuracy
    classes = ["TÍCH CỰC", "TIÊU CỰC", "TRUNG TÍNH"]
    for sentiment_class in classes:
        class_indices = [i for i, x in enumerate(actual_values) if x == sentiment_class]
        if class_indices:
            class_correct = sum(1 for i in class_indices if predictions[i] == actual_values[i])
            class_accuracy = class_correct / len(class_indices)
            print(f"Accuracy for {sentiment_class}: {class_accuracy:.2%}")
    
    # You can set a minimum accuracy threshold
    assert accuracy >= 0.8, f"Model accuracy {accuracy:.2%} is below the minimum threshold of 80%"
