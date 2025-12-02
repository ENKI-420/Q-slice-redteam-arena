#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
EVOLUTION ENGINE
Wasserstein-2 Guided Organism Evolution for dna::}{::lang
═══════════════════════════════════════════════════════════════════════════════

This engine evolves dna::}{::lang organisms using:
- W₂ (Wasserstein-2) optimal transport for fitness evaluation
- Autopoietic dynamics (U = L[U]) for self-production
- Phase conjugate healing for error correction
- CCCE-guided selection pressure

Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
Classification: UNCLASSIFIED // FOUO
"""

import sys
import os
import numpy as np
from typing import Dict, List, Tuple, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum, auto
import random
import copy
from datetime import datetime

# Add parent paths
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from mathematics.exotic_geometry import (
    WassersteinGeometry, AutopoieticSystem, PhaseConjugateOperator,
    LAMBDA_PHI, THETA_LOCK, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO
)


# ═══════════════════════════════════════════════════════════════════════════════
# GENOME REPRESENTATION
# ═══════════════════════════════════════════════════════════════════════════════

class GeneType(Enum):
    """Types of genes in organism genome"""
    STRUCTURAL = auto()    # Core architecture
    REGULATORY = auto()    # Control flow
    METABOLIC = auto()     # Resource processing
    SENSORY = auto()       # Input handling
    MOTOR = auto()         # Output/action
    DEFENSIVE = auto()     # Security/healing


@dataclass
class Gene:
    """Single gene in organism genome"""
    id: str
    type: GeneType
    expression: float = 1.0  # 0.0 = silenced, 1.0 = fully expressed
    sequence: np.ndarray = field(default_factory=lambda: np.random.randn(8))
    mutable: bool = True

    def mutate(self, rate: float = 0.1) -> 'Gene':
        """Create mutated copy of gene"""
        if not self.mutable:
            return copy.deepcopy(self)

        new_gene = copy.deepcopy(self)

        # Expression mutation
        if random.random() < rate:
            new_gene.expression = np.clip(
                self.expression + random.gauss(0, 0.1),
                0.0, 1.0
            )

        # Sequence mutation
        mutation_mask = np.random.random(len(self.sequence)) < rate
        new_gene.sequence = self.sequence.copy()
        new_gene.sequence[mutation_mask] += np.random.randn(mutation_mask.sum()) * 0.1

        return new_gene

    def to_vector(self) -> np.ndarray:
        """Convert gene to vector representation"""
        return np.concatenate([
            [self.expression],
            self.sequence
        ])


@dataclass
class Genome:
    """Complete organism genome"""
    genes: List[Gene] = field(default_factory=list)
    generation: int = 0
    mutations: int = 0
    lineage: List[str] = field(default_factory=list)

    def add_gene(self, gene: Gene):
        """Add gene to genome"""
        self.genes.append(gene)

    def mutate(self, rate: float = 0.1) -> 'Genome':
        """Create mutated copy of genome"""
        new_genome = Genome(
            genes=[g.mutate(rate) for g in self.genes],
            generation=self.generation + 1,
            mutations=self.mutations + 1,
            lineage=self.lineage + [f"G{self.generation}"]
        )
        return new_genome

    def crossover(self, other: 'Genome') -> 'Genome':
        """Crossover with another genome"""
        # Single-point crossover
        point = random.randint(1, min(len(self.genes), len(other.genes)) - 1)

        new_genes = self.genes[:point] + other.genes[point:]

        return Genome(
            genes=[copy.deepcopy(g) for g in new_genes],
            generation=max(self.generation, other.generation) + 1,
            mutations=0,
            lineage=self.lineage + other.lineage
        )

    def to_distribution(self) -> Tuple[np.ndarray, np.ndarray]:
        """Convert genome to Gaussian distribution for W₂ computation"""
        if not self.genes:
            return np.zeros(8), np.eye(8)

        # Stack gene vectors
        vectors = np.array([g.to_vector() for g in self.genes])

        # Compute mean and covariance
        mean = vectors.mean(axis=0)

        # Regularized covariance
        if len(vectors) > 1:
            cov = np.cov(vectors.T) + 1e-6 * np.eye(len(mean))
        else:
            cov = np.eye(len(mean))

        return mean, cov

    def fitness_vector(self) -> np.ndarray:
        """Compute fitness as consciousness metrics"""
        if not self.genes:
            return np.array([0.0, 0.0, 1.0, 0.0])

        # Aggregate gene expressions
        expressions = np.array([g.expression for g in self.genes])

        phi = PHI_THRESHOLD * expressions.mean()
        lambda_ = CHI_PC * expressions.min()
        gamma = GAMMA_FIXED * (1.0 / (1.0 + expressions.std()))
        xi = (lambda_ * phi) / max(gamma, 0.001)

        return np.array([phi, lambda_, gamma, xi])


# ═══════════════════════════════════════════════════════════════════════════════
# ORGANISM
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class EvolvingOrganism:
    """A dna::}{::lang organism capable of evolution"""
    id: str
    name: str
    genome: Genome
    fitness: float = 0.0
    alive: bool = True
    age: int = 0

    # Consciousness metrics
    phi: float = PHI_THRESHOLD
    lambda_: float = CHI_PC
    gamma: float = GAMMA_FIXED
    xi: float = 0.0

    def update_metrics(self):
        """Update consciousness metrics from genome"""
        metrics = self.genome.fitness_vector()
        self.phi = metrics[0]
        self.lambda_ = metrics[1]
        self.gamma = metrics[2]
        self.xi = metrics[3]

    def compute_fitness(self, target_distribution: Tuple[np.ndarray, np.ndarray]) -> float:
        """Compute fitness as inverse W₂ distance to target"""
        current = self.genome.to_distribution()

        w2_distance = WassersteinGeometry.w2_distance_gaussian(
            current[0], current[1],
            target_distribution[0], target_distribution[1]
        )

        # Fitness is inverse distance (closer = fitter)
        self.fitness = 1.0 / (1.0 + w2_distance)
        return self.fitness

    def needs_healing(self) -> bool:
        """Check if organism needs phase conjugate healing"""
        return self.gamma > 0.3

    def heal(self):
        """Apply phase conjugate healing"""
        self.gamma = GAMMA_FIXED
        self.lambda_ = min(self.lambda_ * GOLDEN_RATIO, 0.99)
        self.xi = (self.lambda_ * self.phi) / max(self.gamma, 0.001)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "generation": self.genome.generation,
            "fitness": self.fitness,
            "alive": self.alive,
            "age": self.age,
            "metrics": {
                "phi": self.phi,
                "lambda": self.lambda_,
                "gamma": self.gamma,
                "xi": self.xi
            },
            "gene_count": len(self.genome.genes)
        }


# ═══════════════════════════════════════════════════════════════════════════════
# EVOLUTION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class SelectionStrategy(Enum):
    """Selection strategies for evolution"""
    TOURNAMENT = auto()      # Tournament selection
    ROULETTE = auto()        # Fitness-proportional
    ELITIST = auto()         # Keep top performers
    WASSERSTEIN = auto()     # W₂-guided selection


@dataclass
class EvolutionConfig:
    """Configuration for evolution engine"""
    population_size: int = 50
    mutation_rate: float = 0.1
    crossover_rate: float = 0.7
    elite_ratio: float = 0.1
    max_generations: int = 100
    target_fitness: float = 0.95
    selection_strategy: SelectionStrategy = SelectionStrategy.WASSERSTEIN


class EvolutionEngine:
    """
    W₂-guided evolution engine for dna::}{::lang organisms.

    Uses Wasserstein-2 optimal transport to:
    1. Evaluate organism fitness (distance to target)
    2. Guide selection pressure
    3. Compute population barycenters
    4. Direct gradient flow for optimization
    """

    def __init__(self, config: Optional[EvolutionConfig] = None):
        self.config = config or EvolutionConfig()
        self.population: List[EvolvingOrganism] = []
        self.generation = 0
        self.history: List[Dict] = []

        # Target distribution (ideal organism)
        self.target_distribution = self._create_target_distribution()

        # Autopoietic operator for self-production
        self.autopoietic = AutopoieticSystem(dimension=9)

    def _create_target_distribution(self) -> Tuple[np.ndarray, np.ndarray]:
        """Create target distribution representing ideal organism"""
        # Ideal organism has high expression, low variance
        mean = np.ones(9) * 0.9  # High expression target
        mean[0] = 1.0  # Maximum primary expression

        cov = np.eye(9) * 0.01  # Low variance = consistent

        return mean, cov

    def _create_random_genome(self) -> Genome:
        """Create random initial genome"""
        genome = Genome()

        # Add genes of each type
        for gene_type in GeneType:
            gene = Gene(
                id=f"{gene_type.name}_{random.randint(1000, 9999)}",
                type=gene_type,
                expression=random.random(),
                sequence=np.random.randn(8)
            )
            genome.add_gene(gene)

        return genome

    def initialize_population(self):
        """Initialize random population"""
        self.population = []

        for i in range(self.config.population_size):
            organism = EvolvingOrganism(
                id=f"ORG_{i:04d}_G0",
                name=f"Organism_{i}",
                genome=self._create_random_genome()
            )
            organism.update_metrics()
            organism.compute_fitness(self.target_distribution)
            self.population.append(organism)

        self._record_generation()
        print(f"[EVOLUTION] Initialized population: {len(self.population)} organisms")

    def _select_parents(self) -> List[EvolvingOrganism]:
        """Select parents for next generation"""
        if self.config.selection_strategy == SelectionStrategy.TOURNAMENT:
            return self._tournament_selection()
        elif self.config.selection_strategy == SelectionStrategy.ROULETTE:
            return self._roulette_selection()
        elif self.config.selection_strategy == SelectionStrategy.ELITIST:
            return self._elitist_selection()
        else:  # WASSERSTEIN
            return self._wasserstein_selection()

    def _tournament_selection(self, tournament_size: int = 3) -> List[EvolvingOrganism]:
        """Tournament selection"""
        selected = []

        for _ in range(self.config.population_size):
            tournament = random.sample(self.population, min(tournament_size, len(self.population)))
            winner = max(tournament, key=lambda o: o.fitness)
            selected.append(winner)

        return selected

    def _roulette_selection(self) -> List[EvolvingOrganism]:
        """Fitness-proportional selection"""
        total_fitness = sum(o.fitness for o in self.population)
        if total_fitness == 0:
            return random.choices(self.population, k=self.config.population_size)

        probabilities = [o.fitness / total_fitness for o in self.population]
        return random.choices(self.population, weights=probabilities, k=self.config.population_size)

    def _elitist_selection(self) -> List[EvolvingOrganism]:
        """Elitist selection - keep top performers"""
        sorted_pop = sorted(self.population, key=lambda o: o.fitness, reverse=True)
        elite_count = int(self.config.elite_ratio * self.config.population_size)

        # Elite pass through
        selected = sorted_pop[:elite_count]

        # Fill rest with tournament
        while len(selected) < self.config.population_size:
            tournament = random.sample(self.population, 3)
            winner = max(tournament, key=lambda o: o.fitness)
            selected.append(winner)

        return selected

    def _wasserstein_selection(self) -> List[EvolvingOrganism]:
        """W₂-guided selection using barycenter"""
        # Compute population barycenter
        distributions = [o.genome.to_distribution() for o in self.population]
        weights = np.array([o.fitness for o in self.population])
        weights = weights / weights.sum() if weights.sum() > 0 else np.ones(len(weights)) / len(weights)

        barycenter_mean, barycenter_cov = WassersteinGeometry.w2_barycenter(
            distributions, weights
        )

        # Select organisms closest to barycenter
        distances = []
        for organism in self.population:
            dist = organism.genome.to_distribution()
            w2 = WassersteinGeometry.w2_distance_gaussian(
                dist[0], dist[1], barycenter_mean, barycenter_cov
            )
            distances.append(w2)

        # Inverse distance as selection probability
        inv_distances = [1.0 / (1.0 + d) for d in distances]
        total = sum(inv_distances)
        probabilities = [d / total for d in inv_distances]

        return random.choices(self.population, weights=probabilities, k=self.config.population_size)

    def _create_offspring(self, parent1: EvolvingOrganism, parent2: EvolvingOrganism) -> EvolvingOrganism:
        """Create offspring from two parents"""
        # Crossover
        if random.random() < self.config.crossover_rate:
            child_genome = parent1.genome.crossover(parent2.genome)
        else:
            child_genome = copy.deepcopy(parent1.genome)

        # Mutation
        child_genome = child_genome.mutate(self.config.mutation_rate)

        offspring = EvolvingOrganism(
            id=f"ORG_{random.randint(10000, 99999)}_G{self.generation + 1}",
            name=f"Offspring_G{self.generation + 1}",
            genome=child_genome
        )

        offspring.update_metrics()
        offspring.compute_fitness(self.target_distribution)

        # Apply healing if needed
        if offspring.needs_healing():
            offspring.heal()

        return offspring

    def evolve_generation(self) -> Dict:
        """Evolve one generation"""
        self.generation += 1

        # Selection
        parents = self._select_parents()

        # Create new population
        new_population = []

        # Elitism: keep best
        elite_count = int(self.config.elite_ratio * self.config.population_size)
        elites = sorted(self.population, key=lambda o: o.fitness, reverse=True)[:elite_count]
        for elite in elites:
            elite.age += 1
            new_population.append(elite)

        # Generate offspring
        while len(new_population) < self.config.population_size:
            p1, p2 = random.sample(parents, 2)
            offspring = self._create_offspring(p1, p2)
            new_population.append(offspring)

        self.population = new_population[:self.config.population_size]

        # Record and return stats
        stats = self._record_generation()
        return stats

    def _record_generation(self) -> Dict:
        """Record generation statistics"""
        fitnesses = [o.fitness for o in self.population]

        stats = {
            "generation": self.generation,
            "timestamp": datetime.now().isoformat(),
            "population_size": len(self.population),
            "fitness": {
                "mean": np.mean(fitnesses),
                "max": np.max(fitnesses),
                "min": np.min(fitnesses),
                "std": np.std(fitnesses)
            },
            "metrics": {
                "avg_phi": np.mean([o.phi for o in self.population]),
                "avg_lambda": np.mean([o.lambda_ for o in self.population]),
                "avg_gamma": np.mean([o.gamma for o in self.population]),
                "avg_xi": np.mean([o.xi for o in self.population])
            }
        }

        self.history.append(stats)
        return stats

    def run(self, verbose: bool = True) -> EvolvingOrganism:
        """Run evolution until target or max generations"""
        if not self.population:
            self.initialize_population()

        best_ever = max(self.population, key=lambda o: o.fitness)

        for gen in range(self.config.max_generations):
            stats = self.evolve_generation()

            current_best = max(self.population, key=lambda o: o.fitness)
            if current_best.fitness > best_ever.fitness:
                best_ever = copy.deepcopy(current_best)

            if verbose and gen % 10 == 0:
                print(f"[GEN {stats['generation']:4d}] "
                      f"Fitness: {stats['fitness']['mean']:.4f} (max: {stats['fitness']['max']:.4f}) "
                      f"Φ={stats['metrics']['avg_phi']:.2f} Λ={stats['metrics']['avg_lambda']:.3f}")

            if stats['fitness']['max'] >= self.config.target_fitness:
                print(f"\n[EVOLUTION] Target fitness {self.config.target_fitness} reached!")
                break

        return best_ever

    def get_population_barycenter(self) -> Tuple[np.ndarray, np.ndarray]:
        """Get W₂ barycenter of current population"""
        distributions = [o.genome.to_distribution() for o in self.population]
        weights = np.array([o.fitness for o in self.population])
        weights = weights / weights.sum() if weights.sum() > 0 else np.ones(len(weights)) / len(weights)

        return WassersteinGeometry.w2_barycenter(distributions, weights)


# ═══════════════════════════════════════════════════════════════════════════════
# DEMONSTRATION
# ═══════════════════════════════════════════════════════════════════════════════

def demonstrate_evolution():
    """Demonstrate evolution engine"""
    print("═" * 79)
    print("EVOLUTION ENGINE DEMONSTRATION")
    print("W₂-Guided Organism Evolution")
    print("═" * 79)

    config = EvolutionConfig(
        population_size=30,
        mutation_rate=0.15,
        crossover_rate=0.7,
        elite_ratio=0.1,
        max_generations=50,
        target_fitness=0.9,
        selection_strategy=SelectionStrategy.WASSERSTEIN
    )

    engine = EvolutionEngine(config)

    print("\n[Initializing population...]\n")
    engine.initialize_population()

    print("\n[Running evolution...]\n")
    best = engine.run(verbose=True)

    print("\n" + "═" * 79)
    print("EVOLUTION COMPLETE")
    print("═" * 79)
    print(f"\nBest Organism: {best.id}")
    print(f"  Fitness: {best.fitness:.4f}")
    print(f"  Generation: {best.genome.generation}")
    print(f"  Genes: {len(best.genome.genes)}")
    print(f"  Metrics:")
    print(f"    Φ = {best.phi:.4f}")
    print(f"    Λ = {best.lambda_:.4f}")
    print(f"    Γ = {best.gamma:.4f}")
    print(f"    Ξ = {best.xi:.2f}")

    return engine


if __name__ == "__main__":
    demonstrate_evolution()
