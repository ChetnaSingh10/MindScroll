from typing import List
from .schemas import PredictRequest, SuggestionItem

def generate_suggestions(data: PredictRequest, score: float) -> List[SuggestionItem]:
    suggestions: List[SuggestionItem] = []

    # 1. Screen Time & Digital Habit
    if data.Avg_Daily_Usage_Hours >= 6.0:
        suggestions.append(SuggestionItem(
            title="Implement Screen-Free Micro Breaks",
            description=f"Your current daily usage is {data.Avg_Daily_Usage_Hours:.1f}h. Trying a 20-20-20 rule or setting a 45-minute daily timer for {data.Most_Used_Platform} can significantly reduce digital cognitive load.",
            category="screen_time",
            icon="Smartphone"
        ))
    elif data.Avg_Daily_Usage_Hours >= 4.0:
        suggestions.append(SuggestionItem(
            title="Curate Intentional Feeds",
            description="Since entertainment and passive browsing tend to extend screen sessions, try turning off push notifications for secondary apps to prevent habitual checking.",
            category="screen_time",
            icon="BellOff"
        ))
    else:
        suggestions.append(SuggestionItem(
            title="Maintain Digital Equilibrium",
            description=f"Great job keeping daily social usage at {data.Avg_Daily_Usage_Hours:.1f}h. Continue prioritising conscious, intentional digital interaction.",
            category="screen_time",
            icon="Sparkles"
        ))

    # 2. Sleep Architecture
    if data.Sleep_Hours_Per_Night < 6.5:
        suggestions.append(SuggestionItem(
            title="Protect the Wind-Down Window",
            description=f"Averaging {data.Sleep_Hours_Per_Night:.1f} hours of sleep strongly correlates with increased mental fatigue. Establishing a phone-docking station away from the bed 30 minutes before sleep can improve rest quality.",
            category="sleep",
            icon="Moon"
        ))
    elif data.Sleep_Hours_Per_Night > 9.0:
        suggestions.append(SuggestionItem(
            title="Anchor Morning Circadian Rhythms",
            description="High sleep durations paired with daytime fatigue can indicate irregular sleep cycles. Morning sunlight exposure within 20 minutes of waking helps steady circadian timing.",
            category="sleep",
            icon="Sun"
        ))
    else:
        suggestions.append(SuggestionItem(
            title="Consistent Rest Schedule",
            description=f"Your {data.Sleep_Hours_Per_Night:.1f}h sleep window is in the healthy zone. Keeping consistent bed and wake times on weekends will solidify cognitive resilience.",
            category="sleep",
            icon="CheckCircle2"
        ))

    # 3. Physical Movement
    if data.Physical_Activity_Hours < 0.5:
        suggestions.append(SuggestionItem(
            title="Introduce 15-Minute Daily Strolls",
            description="Zero or minimal physical activity compounds the sedentary effects of screen time. A brisk 15-minute walk outside elevates endorphins and acts as a natural mental reset.",
            category="activity",
            icon="Activity"
        ))
    elif data.Physical_Activity_Hours >= 1.5:
        suggestions.append(SuggestionItem(
            title="High Physical Resilience Factor",
            description=f"Your {data.Physical_Activity_Hours:.1f}h of daily exercise is a major protective buffer for mental well-being in the model. Keep this routine active!",
            category="activity",
            icon="Dumbbell"
        ))
    else:
        suggestions.append(SuggestionItem(
            title="Elevate Movement Density",
            description="Moderate movement supports positive mood states. Experiment with study breaks involving light stretching or stairs between academic sessions.",
            category="activity",
            icon="HeartPulse"
        ))

    # 4. Phone Unlocks & Cognitive Distraction
    if data.Daily_Unlocks >= 90:
        suggestions.append(SuggestionItem(
            title="Reduce Context Switching",
            description=f"Unlocking your device {data.Daily_Unlocks} times/day fragments attention. Batch your notifications into two scheduled check-ins per afternoon to protect deep focus.",
            category="routine",
            icon="EyeOff"
        ))

    # 5. Stress Level Interventions
    if data.Stress_Level in ['High', 'Very High']:
        suggestions.append(SuggestionItem(
            title="Decompress with Box Breathing",
            description="When academic stress spikes, 4 rounds of 4-second box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) can quickly regulate sympathetic nervous system arousal.",
            category="stress",
            icon="Wind"
        ))

    # Limit to top 4 most pertinent recommendations
    return suggestions[:4]
