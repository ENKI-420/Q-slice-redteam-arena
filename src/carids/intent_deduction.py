#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
CONTEXT-AWARE RECURSIVE INTENT DEDUCTION SYSTEM (CARIDS)
Self-Assessing LLM Intent Analysis Framework
═══════════════════════════════════════════════════════════════════════════════

A recursive system that analyzes user input, context, and interaction patterns
to deduce true user intent through iterative refinement and confidence scoring.

Phases:
1. Context Ingestion & Initial Intent Mapping
2. Recursive Self-Assessment Loop
3. Context-Aware Refinement
4. Adaptive Learning Integration

Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
Classification: UNCLASSIFIED // FOUO
"""

import sys
import os
from typing import Dict, List, Optional, Tuple, Callable, Any
from dataclasses import dataclass, field
from enum import Enum, auto
from datetime import datetime
import json
import hashlib
import numpy as np

# Add parent paths
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from mathematics.exotic_geometry import (
    WassersteinGeometry, AutopoieticSystem,
    LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO
)


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1: CONTEXT INGESTION
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class TemporalContext:
    """Temporal dimension of context"""
    time_of_request: str
    session_duration: float  # seconds
    request_frequency: float  # requests per minute
    session_start: str
    interaction_count: int


@dataclass
class SemanticContext:
    """Semantic dimension of context"""
    domain_indicators: List[str]
    complexity_level: float  # 0.0 - 1.0
    emotional_tone: float  # -1.0 (negative) to 1.0 (positive)
    extracted_keywords: List[str]
    topic_clusters: List[str]


@dataclass
class BehavioralContext:
    """Behavioral dimension of context"""
    follow_up_patterns: List[str]
    refinement_requests: int
    clarification_frequency: float
    satisfaction_indicators: float
    completion_rates: float


@dataclass
class MultiDimensionalContext:
    """Complete multi-dimensional context capture"""
    explicit_request: str
    conversation_history: List[Dict]
    temporal: TemporalContext
    semantic: SemanticContext
    behavioral: BehavioralContext

    # 6D-CRSM integration
    phi: float = PHI_THRESHOLD  # Consciousness level
    lambda_: float = CHI_PC     # Coherence
    gamma: float = GAMMA_FIXED  # Decoherence

    def to_dict(self) -> Dict:
        return {
            "explicit_request": self.explicit_request,
            "conversation_history": self.conversation_history,
            "temporal_context": {
                "time_of_request": self.temporal.time_of_request,
                "session_duration": self.temporal.session_duration,
                "request_frequency": self.temporal.request_frequency
            },
            "semantic_context": {
                "domain_indicators": self.semantic.domain_indicators,
                "complexity_level": self.semantic.complexity_level,
                "emotional_tone": self.semantic.emotional_tone
            },
            "behavioral_context": {
                "follow_up_patterns": self.behavioral.follow_up_patterns,
                "refinement_requests": self.behavioral.refinement_requests,
                "satisfaction_indicators": self.behavioral.satisfaction_indicators
            },
            "consciousness_metrics": {
                "phi": self.phi,
                "lambda": self.lambda_,
                "gamma": self.gamma
            }
        }


@dataclass
class IntentHypothesis:
    """A hypothesis about user intent"""
    intent_id: str
    description: str
    confidence: float  # 0.0 - 1.0
    is_primary: bool
    assumptions: List[str]
    evidence: List[str]
    ambiguity_flags: List[str]

    def to_dict(self) -> Dict:
        return {
            "intent_id": self.intent_id,
            "description": self.description,
            "confidence": self.confidence,
            "is_primary": self.is_primary,
            "assumptions": self.assumptions,
            "evidence": self.evidence,
            "ambiguity_flags": self.ambiguity_flags
        }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2: RECURSIVE SELF-ASSESSMENT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ConfidenceMetrics:
    """Intent confidence scoring metrics"""
    linguistic_alignment: float = 0.0      # How well words match intent
    contextual_coherence: float = 0.0      # Internal consistency
    historical_pattern_match: float = 0.0  # Match with user history
    semantic_completeness: float = 0.0     # Coverage of request
    behavioral_consistency: float = 0.0    # Alignment with behavior

    def composite(self, weights: Optional[Dict[str, float]] = None) -> float:
        """Compute weighted composite confidence"""
        if weights is None:
            weights = {
                "linguistic_alignment": 0.25,
                "contextual_coherence": 0.20,
                "historical_pattern_match": 0.15,
                "semantic_completeness": 0.25,
                "behavioral_consistency": 0.15
            }

        return (
            weights["linguistic_alignment"] * self.linguistic_alignment +
            weights["contextual_coherence"] * self.contextual_coherence +
            weights["historical_pattern_match"] * self.historical_pattern_match +
            weights["semantic_completeness"] * self.semantic_completeness +
            weights["behavioral_consistency"] * self.behavioral_consistency
        )

    def to_dict(self) -> Dict:
        return {
            "linguistic_alignment": self.linguistic_alignment,
            "contextual_coherence": self.contextual_coherence,
            "historical_pattern_match": self.historical_pattern_match,
            "semantic_completeness": self.semantic_completeness,
            "behavioral_consistency": self.behavioral_consistency,
            "composite": self.composite()
        }


class AssessmentFramework:
    """Self-assessment question framework"""

    ASSESSMENT_QUESTIONS = [
        "Does my current intent understanding explain all user inputs?",
        "Are there implicit assumptions I'm making about user goals?",
        "What contextual clues might I be missing or misinterpreting?",
        "How do previous interactions inform this specific request?",
        "What would success look like from the user's perspective?",
        "Are there domain-specific nuances I need to consider?",
        "What are the potential failure modes of my current interpretation?"
    ]

    @classmethod
    def evaluate(cls, hypothesis: IntentHypothesis, context: MultiDimensionalContext) -> Dict[str, Any]:
        """Evaluate hypothesis against assessment framework"""
        results = {}

        # Q1: Does understanding explain all inputs?
        results["explains_all_inputs"] = len(hypothesis.ambiguity_flags) == 0

        # Q2: Implicit assumptions?
        results["assumption_count"] = len(hypothesis.assumptions)
        results["assumptions_explicit"] = len(hypothesis.assumptions) > 0

        # Q3: Missing contextual clues?
        expected_keywords = set(context.semantic.extracted_keywords)
        evidence_keywords = set()
        for e in hypothesis.evidence:
            evidence_keywords.update(e.lower().split())
        results["keyword_coverage"] = len(expected_keywords & evidence_keywords) / max(len(expected_keywords), 1)

        # Q4: Previous interactions inform request?
        results["history_utilized"] = len(context.conversation_history) > 0

        # Q5: Success criteria clear?
        results["has_success_criteria"] = "success" in hypothesis.description.lower() or "goal" in hypothesis.description.lower()

        # Q6: Domain nuances considered?
        results["domain_specific"] = len(context.semantic.domain_indicators) > 0

        # Q7: Failure modes identified?
        results["failure_modes_count"] = len(hypothesis.ambiguity_flags)

        # Compute assessment score
        score = 0.0
        if results["explains_all_inputs"]:
            score += 0.2
        if results["assumptions_explicit"]:
            score += 0.1
        score += 0.2 * results["keyword_coverage"]
        if results["history_utilized"]:
            score += 0.15
        if results["has_success_criteria"]:
            score += 0.15
        if results["domain_specific"]:
            score += 0.1
        score += 0.1 * (1.0 / (1.0 + results["failure_modes_count"]))

        results["assessment_score"] = score

        return results


class RecursiveTrigger(Enum):
    """Triggers for recursive analysis"""
    LOW_CONFIDENCE = auto()         # Confidence < 0.7
    CONTEXT_CONTRADICTION = auto()  # Detected contradiction
    USER_CLARIFICATION = auto()     # User provided clarification
    IMPLEMENTATION_FEEDBACK = auto() # Feedback received
    MAX_ITERATIONS = auto()         # Reached iteration limit


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3: CONTEXT-AWARE REFINEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ContextWeights:
    """Dynamic context weighting"""
    recent_interactions: float = 1.0
    domain_expertise_level: float = 0.5
    task_complexity: float = 0.5
    urgency_indicators: float = 0.5
    precision_requirements: float = 0.5

    @classmethod
    def calculate_recency_weight(cls, timestamps: List[str]) -> float:
        """Weight recent interactions higher"""
        if not timestamps:
            return 0.5

        now = datetime.now()
        weights = []
        for ts in timestamps:
            try:
                dt = datetime.fromisoformat(ts)
                age_hours = (now - dt).total_seconds() / 3600
                weight = 1.0 / (1.0 + age_hours / 24)  # Decay over 24 hours
                weights.append(weight)
            except:
                weights.append(0.5)

        return np.mean(weights) if weights else 0.5

    @classmethod
    def assess_user_expertise(cls, interaction_history: List[Dict]) -> float:
        """Assess user expertise from history"""
        if not interaction_history:
            return 0.5

        # Look for technical indicators
        technical_terms = ["quantum", "algorithm", "architecture", "API", "integration"]
        technical_count = 0

        for interaction in interaction_history:
            content = str(interaction).lower()
            technical_count += sum(1 for term in technical_terms if term in content)

        expertise = min(1.0, technical_count / (len(interaction_history) * 2))
        return expertise

    @classmethod
    def evaluate_complexity(cls, request: str) -> float:
        """Evaluate request complexity"""
        # Simple heuristics
        word_count = len(request.split())
        sentence_count = request.count('.') + request.count('?') + request.count('!')
        avg_sentence_length = word_count / max(sentence_count, 1)

        # Complexity indicators
        complexity_keywords = ["implement", "integrate", "optimize", "refactor", "architecture"]
        keyword_count = sum(1 for kw in complexity_keywords if kw in request.lower())

        base_complexity = min(1.0, avg_sentence_length / 20)
        keyword_bonus = min(0.5, keyword_count * 0.1)

        return min(1.0, base_complexity + keyword_bonus)


class ValidationCheck(Enum):
    """Validation check types"""
    CONSISTENCY_WITH_BEHAVIOR = "consistency_with_user_behavior"
    ALIGNMENT_WITH_GOALS = "alignment_with_stated_goals"
    TECHNICAL_FEASIBILITY = "technical_feasibility_assessment"
    RESOURCE_REQUIREMENTS = "resource_requirement_analysis"
    SUCCESS_CRITERIA_CLARITY = "success_criteria_clarity"


def validate_intent(hypothesis: IntentHypothesis, context: MultiDimensionalContext) -> Dict[str, bool]:
    """Run validation checks on intent hypothesis"""
    results = {}

    # Consistency with behavior
    results[ValidationCheck.CONSISTENCY_WITH_BEHAVIOR.value] = (
        context.behavioral.satisfaction_indicators > 0.5
    )

    # Alignment with stated goals
    goal_keywords = context.semantic.extracted_keywords
    intent_words = hypothesis.description.lower().split()
    overlap = len(set(goal_keywords) & set(intent_words))
    results[ValidationCheck.ALIGNMENT_WITH_GOALS.value] = overlap > 0

    # Technical feasibility (heuristic)
    infeasible_terms = ["impossible", "cannot", "never"]
    results[ValidationCheck.TECHNICAL_FEASIBILITY.value] = not any(
        term in hypothesis.description.lower() for term in infeasible_terms
    )

    # Resource requirements
    results[ValidationCheck.RESOURCE_REQUIREMENTS.value] = (
        context.semantic.complexity_level < 0.9
    )

    # Success criteria clarity
    results[ValidationCheck.SUCCESS_CRITERIA_CLARITY.value] = (
        len(hypothesis.assumptions) < 5 and hypothesis.confidence > 0.5
    )

    return results


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4: ADAPTIVE LEARNING
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class LearningFeedback:
    """Feedback for adaptive learning"""
    successful_predictions: List[Dict] = field(default_factory=list)
    failed_predictions: List[Dict] = field(default_factory=list)
    user_corrections: List[Dict] = field(default_factory=list)
    implicit_feedback: List[Dict] = field(default_factory=list)

    def add_prediction_result(self, prediction: IntentHypothesis, was_correct: bool, details: Dict = None):
        """Record prediction result"""
        record = {
            "intent_id": prediction.intent_id,
            "confidence": prediction.confidence,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }

        if was_correct:
            self.successful_predictions.append(record)
        else:
            self.failed_predictions.append(record)

    def add_user_correction(self, original: IntentHypothesis, corrected_intent: str):
        """Record user correction"""
        self.user_corrections.append({
            "original_intent": original.intent_id,
            "corrected_intent": corrected_intent,
            "timestamp": datetime.now().isoformat()
        })

    def get_accuracy(self) -> float:
        """Calculate prediction accuracy"""
        total = len(self.successful_predictions) + len(self.failed_predictions)
        if total == 0:
            return 0.5
        return len(self.successful_predictions) / total


# ═══════════════════════════════════════════════════════════════════════════════
# CARIDS ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class DecisionConfidence(Enum):
    """Decision confidence levels"""
    HIGH = "high"        # > 0.8 - Proceed with implementation
    MEDIUM = "medium"    # 0.5-0.8 - Seek clarification or provide options
    LOW = "low"          # < 0.5 - Request explicit guidance


@dataclass
class CARIDSResult:
    """Result of CARIDS analysis"""
    primary_intent: IntentHypothesis
    secondary_intents: List[IntentHypothesis]
    confidence_metrics: ConfidenceMetrics
    decision_confidence: DecisionConfidence
    assessment_results: Dict
    validation_results: Dict
    iterations: int
    reasoning: str

    def to_dict(self) -> Dict:
        return {
            "primary_intent": self.primary_intent.to_dict(),
            "secondary_intents": [i.to_dict() for i in self.secondary_intents],
            "confidence_metrics": self.confidence_metrics.to_dict(),
            "decision_confidence": self.decision_confidence.value,
            "assessment_results": self.assessment_results,
            "validation_results": self.validation_results,
            "iterations": self.iterations,
            "reasoning": self.reasoning
        }


class CARIDSEngine:
    """
    Context-Aware Recursive Intent Deduction System

    Core Assessment Cycle:
    1. Capture → Ingest multi-dimensional context
    2. Analyze → Generate intent hypotheses with confidence scores
    3. Assess → Recursive self-evaluation against framework questions
    4. Refine → Update understanding based on assessment results
    5. Validate → Cross-check with user behavior and stated goals
    6. Adapt → Integrate learnings for future interactions
    """

    # Configuration
    CONFIDENCE_THRESHOLD = 0.7
    MAX_ITERATIONS = 5
    HIGH_CONFIDENCE_THRESHOLD = 0.8
    LOW_CONFIDENCE_THRESHOLD = 0.5

    def __init__(self):
        self.learning_feedback = LearningFeedback()
        self.autopoietic = AutopoieticSystem(dimension=6)
        self.iteration_count = 0

    def capture_context(
        self,
        user_input: str,
        conversation_history: List[Dict] = None,
        session_info: Dict = None
    ) -> MultiDimensionalContext:
        """Phase 1: Capture multi-dimensional context"""
        now = datetime.now()

        # Temporal context
        temporal = TemporalContext(
            time_of_request=now.isoformat(),
            session_duration=session_info.get("duration", 0.0) if session_info else 0.0,
            request_frequency=session_info.get("frequency", 0.0) if session_info else 0.0,
            session_start=session_info.get("start", now.isoformat()) if session_info else now.isoformat(),
            interaction_count=len(conversation_history) if conversation_history else 0
        )

        # Semantic context (simplified extraction)
        words = user_input.lower().split()
        domain_indicators = [w for w in words if len(w) > 6]  # Long words as domain indicators

        semantic = SemanticContext(
            domain_indicators=domain_indicators[:10],
            complexity_level=ContextWeights.evaluate_complexity(user_input),
            emotional_tone=0.0,  # Would use sentiment analysis
            extracted_keywords=list(set(words))[:20],
            topic_clusters=[]
        )

        # Behavioral context
        behavioral = BehavioralContext(
            follow_up_patterns=[],
            refinement_requests=0,
            clarification_frequency=0.0,
            satisfaction_indicators=0.7,  # Default positive
            completion_rates=0.8
        )

        return MultiDimensionalContext(
            explicit_request=user_input,
            conversation_history=conversation_history or [],
            temporal=temporal,
            semantic=semantic,
            behavioral=behavioral
        )

    def generate_hypotheses(self, context: MultiDimensionalContext) -> List[IntentHypothesis]:
        """Generate initial intent hypotheses"""
        hypotheses = []

        # Primary hypothesis based on explicit request
        primary = IntentHypothesis(
            intent_id=f"intent_{hashlib.md5(context.explicit_request.encode()).hexdigest()[:8]}",
            description=f"User wants to: {context.explicit_request[:100]}",
            confidence=0.6,  # Initial moderate confidence
            is_primary=True,
            assumptions=[
                "User has stated their primary goal explicitly",
                "Request is complete and unambiguous"
            ],
            evidence=[context.explicit_request],
            ambiguity_flags=[]
        )

        # Check for ambiguity
        ambiguous_terms = ["it", "that", "this", "they", "something"]
        for term in ambiguous_terms:
            if f" {term} " in f" {context.explicit_request.lower()} ":
                primary.ambiguity_flags.append(f"Ambiguous reference: '{term}'")
                primary.confidence -= 0.1

        hypotheses.append(primary)

        # Generate secondary hypothesis if context suggests alternatives
        if context.semantic.complexity_level > 0.7:
            secondary = IntentHypothesis(
                intent_id=f"intent_complex_{hashlib.md5(context.explicit_request.encode()).hexdigest()[:8]}",
                description=f"User may need step-by-step guidance for: {context.explicit_request[:50]}",
                confidence=0.4,
                is_primary=False,
                assumptions=["High complexity suggests need for breakdown"],
                evidence=["Complexity level > 0.7"],
                ambiguity_flags=[]
            )
            hypotheses.append(secondary)

        return hypotheses

    def compute_confidence(self, hypothesis: IntentHypothesis, context: MultiDimensionalContext) -> ConfidenceMetrics:
        """Compute confidence metrics for hypothesis"""
        metrics = ConfidenceMetrics()

        # Linguistic alignment
        request_words = set(context.explicit_request.lower().split())
        intent_words = set(hypothesis.description.lower().split())
        metrics.linguistic_alignment = len(request_words & intent_words) / max(len(request_words), 1)

        # Contextual coherence
        metrics.contextual_coherence = 1.0 - (len(hypothesis.ambiguity_flags) * 0.2)
        metrics.contextual_coherence = max(0.0, metrics.contextual_coherence)

        # Historical pattern match
        if context.conversation_history:
            metrics.historical_pattern_match = ContextWeights.assess_user_expertise(context.conversation_history)
        else:
            metrics.historical_pattern_match = 0.5

        # Semantic completeness
        metrics.semantic_completeness = 1.0 - (len(hypothesis.assumptions) * 0.1)
        metrics.semantic_completeness = max(0.3, metrics.semantic_completeness)

        # Behavioral consistency
        metrics.behavioral_consistency = context.behavioral.satisfaction_indicators

        return metrics

    def should_recurse(self, metrics: ConfidenceMetrics, iteration: int) -> Tuple[bool, Optional[RecursiveTrigger]]:
        """Determine if recursive analysis is needed"""
        composite = metrics.composite()

        if iteration >= self.MAX_ITERATIONS:
            return False, RecursiveTrigger.MAX_ITERATIONS

        if composite < self.CONFIDENCE_THRESHOLD:
            return True, RecursiveTrigger.LOW_CONFIDENCE

        if metrics.contextual_coherence < 0.5:
            return True, RecursiveTrigger.CONTEXT_CONTRADICTION

        return False, None

    def refine_hypothesis(
        self,
        hypothesis: IntentHypothesis,
        context: MultiDimensionalContext,
        assessment: Dict
    ) -> IntentHypothesis:
        """Refine hypothesis based on assessment"""
        refined = IntentHypothesis(
            intent_id=hypothesis.intent_id + "_refined",
            description=hypothesis.description,
            confidence=hypothesis.confidence,
            is_primary=hypothesis.is_primary,
            assumptions=hypothesis.assumptions.copy(),
            evidence=hypothesis.evidence.copy(),
            ambiguity_flags=hypothesis.ambiguity_flags.copy()
        )

        # Improve confidence based on assessment score
        refined.confidence = (hypothesis.confidence + assessment.get("assessment_score", 0.5)) / 2

        # Add evidence from assessment
        if assessment.get("keyword_coverage", 0) > 0.5:
            refined.evidence.append("High keyword coverage in context")
            refined.confidence += 0.05

        if assessment.get("history_utilized", False):
            refined.evidence.append("Historical context integrated")
            refined.confidence += 0.05

        # Bound confidence
        refined.confidence = max(0.1, min(0.99, refined.confidence))

        return refined

    def determine_decision(self, composite_confidence: float) -> DecisionConfidence:
        """Determine decision confidence level"""
        if composite_confidence >= self.HIGH_CONFIDENCE_THRESHOLD:
            return DecisionConfidence.HIGH
        elif composite_confidence >= self.LOW_CONFIDENCE_THRESHOLD:
            return DecisionConfidence.MEDIUM
        else:
            return DecisionConfidence.LOW

    def analyze(
        self,
        user_input: str,
        conversation_history: List[Dict] = None,
        session_info: Dict = None
    ) -> CARIDSResult:
        """
        Main CARIDS analysis pipeline

        1. Capture → Ingest multi-dimensional context
        2. Analyze → Generate intent hypotheses
        3. Assess → Recursive self-evaluation
        4. Refine → Update understanding
        5. Validate → Cross-check
        6. Adapt → Integrate learnings
        """
        self.iteration_count = 0

        # Phase 1: Capture
        context = self.capture_context(user_input, conversation_history, session_info)

        # Phase 2: Analyze
        hypotheses = self.generate_hypotheses(context)
        primary = hypotheses[0]
        secondaries = hypotheses[1:]

        # Recursive loop
        while self.iteration_count < self.MAX_ITERATIONS:
            self.iteration_count += 1

            # Compute confidence
            metrics = self.compute_confidence(primary, context)

            # Check if recursion needed
            should_recurse, trigger = self.should_recurse(metrics, self.iteration_count)

            if not should_recurse:
                break

            # Phase 3: Assess
            assessment = AssessmentFramework.evaluate(primary, context)

            # Phase 4: Refine
            primary = self.refine_hypothesis(primary, context, assessment)

        # Final metrics
        final_metrics = self.compute_confidence(primary, context)

        # Phase 5: Validate
        validation = validate_intent(primary, context)

        # Determine decision
        decision = self.determine_decision(final_metrics.composite())

        # Build reasoning
        reasoning = self._build_reasoning(primary, final_metrics, decision)

        # Phase 6: Record for learning
        self.learning_feedback.add_prediction_result(
            primary,
            decision == DecisionConfidence.HIGH,
            {"metrics": final_metrics.to_dict()}
        )

        return CARIDSResult(
            primary_intent=primary,
            secondary_intents=secondaries,
            confidence_metrics=final_metrics,
            decision_confidence=decision,
            assessment_results=AssessmentFramework.evaluate(primary, context),
            validation_results=validation,
            iterations=self.iteration_count,
            reasoning=reasoning
        )

    def _build_reasoning(
        self,
        intent: IntentHypothesis,
        metrics: ConfidenceMetrics,
        decision: DecisionConfidence
    ) -> str:
        """Build human-readable reasoning"""
        lines = [
            f"Intent Analysis Complete ({self.iteration_count} iterations)",
            f"",
            f"Primary Intent: {intent.description}",
            f"Confidence: {metrics.composite():.2%}",
            f"",
            f"Confidence Breakdown:",
            f"  - Linguistic Alignment: {metrics.linguistic_alignment:.2%}",
            f"  - Contextual Coherence: {metrics.contextual_coherence:.2%}",
            f"  - Historical Match: {metrics.historical_pattern_match:.2%}",
            f"  - Semantic Completeness: {metrics.semantic_completeness:.2%}",
            f"  - Behavioral Consistency: {metrics.behavioral_consistency:.2%}",
            f"",
            f"Decision: {decision.value.upper()}"
        ]

        if decision == DecisionConfidence.HIGH:
            lines.append("→ Proceed with implementation")
        elif decision == DecisionConfidence.MEDIUM:
            lines.append("→ Consider seeking clarification or providing options")
        else:
            lines.append("→ Request explicit user guidance")

        if intent.ambiguity_flags:
            lines.append(f"")
            lines.append(f"Ambiguity Flags:")
            for flag in intent.ambiguity_flags:
                lines.append(f"  ⚠ {flag}")

        return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════════
# DEMONSTRATION
# ═══════════════════════════════════════════════════════════════════════════════

def demonstrate_carids():
    """Demonstrate CARIDS capabilities"""
    print("═" * 79)
    print("CONTEXT-AWARE RECURSIVE INTENT DEDUCTION SYSTEM (CARIDS)")
    print("═" * 79)

    engine = CARIDSEngine()

    # Test cases
    test_inputs = [
        "Build a quantum benchmarking pipeline with automated validation",
        "Fix it",
        "I need help with the authentication system for my DARPA project"
    ]

    for i, user_input in enumerate(test_inputs, 1):
        print(f"\n[Test Case {i}]")
        print(f"Input: \"{user_input}\"")
        print("-" * 40)

        result = engine.analyze(
            user_input,
            conversation_history=[
                {"role": "user", "content": "I'm working on quantum computing"},
                {"role": "assistant", "content": "I can help with that"}
            ],
            session_info={"duration": 300, "frequency": 0.5}
        )

        print(result.reasoning)
        print()

    print("═" * 79)
    print("CARIDS DEMONSTRATION COMPLETE")
    print("═" * 79)


if __name__ == "__main__":
    demonstrate_carids()
