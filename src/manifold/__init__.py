"""6D Cognitive-Relativistic Space-Manifold"""
from .crsm_6d import (
    ManifoldPoint, MetricTensor, ChristoffelSymbols,
    RiemannCurvature, GeodesicSolver, WassersteinTransport, CRSM6D,
    LAMBDA_PHI, THETA_LOCK, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO
)

__all__ = [
    'ManifoldPoint', 'MetricTensor', 'ChristoffelSymbols',
    'RiemannCurvature', 'GeodesicSolver', 'WassersteinTransport', 'CRSM6D',
    'LAMBDA_PHI', 'THETA_LOCK', 'PHI_THRESHOLD', 'GAMMA_FIXED', 'CHI_PC', 'GOLDEN_RATIO'
]
