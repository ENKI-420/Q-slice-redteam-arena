-- ═══════════════════════════════════════════════════════════════════════════════
-- DARPA-ALIGNED OPERATOR CALIBRATION SCHEMA
-- Supabase PostgreSQL Schema for dna::}{::lang Platform
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Author: Devin Phillip Davis / Agile Defense Systems, LLC (CAGE: 9HUP5)
-- Classification: UNCLASSIFIED // FOUO

-- ═══════════════════════════════════════════════════════════════════════════════
-- EXTENSIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Device types
CREATE TYPE device_type AS ENUM (
  'android_phone',
  'android_foldable',
  'ios_phone',
  'ios_tablet',
  'laptop_windows',
  'laptop_macos',
  'laptop_linux',
  'desktop_workstation',
  'hardened_field_device',
  'virtualized_cloud',
  'virtualized_dod_enclave'
);

-- Network environments
CREATE TYPE network_environment AS ENUM (
  'high_bandwidth_civilian',
  'moderate_bandwidth',
  'intermittent',
  'air_gapped',
  'dod_classified'
);

-- UI performance preferences
CREATE TYPE ui_performance AS ENUM (
  'high_performance',
  'high_fidelity',
  'balanced',
  'adaptive'
);

-- Explanation styles
CREATE TYPE explanation_style AS ENUM (
  'formal_mathematical',
  'visual_geometric',
  'hybrid',
  'minimalist_operational'
);

-- Reasoning tones
CREATE TYPE reasoning_tone AS ENUM (
  'aura_dominant',
  'aiden_dominant',
  'balanced',
  'adaptive'
);

-- Information pacing
CREATE TYPE information_pacing AS ENUM (
  'slow_rigorous',
  'fast_velocity',
  'variable',
  'darpa_brief'
);

-- Creative workflows
CREATE TYPE creative_workflow AS ENUM (
  'concept_first',
  'architecture_first',
  'experimental',
  'mission_driven'
);

-- Problem solving modes
CREATE TYPE problem_solving_mode AS ENUM (
  'top_down',
  'bottom_up',
  'bidirectional',
  'emergent'
);

-- Mission orientations
CREATE TYPE mission_orientation AS ENUM (
  'research_quantum',
  'research_ai',
  'research_cognitive',
  'engineering',
  'automation_orchestration',
  'defense_security',
  'quantum_simulation',
  'multi_agent_swarm',
  'other'
);

-- Cockpit layouts
CREATE TYPE cockpit_layout AS ENUM (
  'aura_left_aiden_right',
  'aiden_left_aura_right',
  'unified_agent',
  'tri_pane',
  'minimalist'
);

-- UI themes
CREATE TYPE ui_theme AS ENUM (
  'dark_quantum',
  'deep_void',
  'cyan_pulse',
  'nebular_glass',
  'high_contrast_accessibility'
);

-- Suggestion preferences
CREATE TYPE suggestion_preference AS ENUM (
  'yes',
  'no',
  'adaptive'
);

-- Workload types
CREATE TYPE workload_type AS ENUM (
  'daily_autonomous',
  'episodic_missions',
  'continuous_monitoring',
  'heavy_qpu',
  'high_intensity_burst'
);

-- Data sensitivity levels
CREATE TYPE data_sensitivity AS ENUM (
  'public',
  'sensitive',
  'confidential',
  'high_side',
  'mixed'
);

-- Agent tones
CREATE TYPE agent_tone AS ENUM (
  'aura',
  'aiden',
  'balanced'
);

-- Environment classes
CREATE TYPE environment_class AS ENUM (
  'civilian',
  'tactical',
  'classified'
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Operators (users)
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  organization TEXT,
  cage_code TEXT,  -- For defense contractors
  clearance_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device profiles
CREATE TABLE device_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  primary_device device_type NOT NULL,
  interaction_modalities TEXT[] DEFAULT '{}',
  network_environment network_environment NOT NULL,
  ui_performance ui_performance NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cognitive profiles
CREATE TABLE cognitive_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  explanation_style explanation_style NOT NULL,
  reasoning_tone reasoning_tone NOT NULL,
  information_pacing information_pacing NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Psi profiles
CREATE TABLE psi_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  creative_workflow creative_workflow NOT NULL,
  problem_solving_mode problem_solving_mode NOT NULL,
  mission_orientation mission_orientation NOT NULL,
  mission_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform profiles
CREATE TABLE platform_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  cockpit_layout cockpit_layout NOT NULL,
  advanced_features TEXT[] DEFAULT '{}',
  theme ui_theme NOT NULL,
  suggestions suggestion_preference NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission profiles
CREATE TABLE mission_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  operational_domains TEXT[] DEFAULT '{}',
  workload_type workload_type NOT NULL,
  data_sensitivity data_sensitivity NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial state vectors (computed)
CREATE TABLE initial_state_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  lambda_0 DOUBLE PRECISION NOT NULL,  -- Λ₀ Initial coherence
  phi_0 DOUBLE PRECISION NOT NULL,     -- Φ₀ Initial consciousness
  gamma_0 DOUBLE PRECISION NOT NULL,   -- Γ₀ Initial decoherence
  tau_0 DOUBLE PRECISION NOT NULL,     -- τ₀ Initial time coordinate
  epsilon_0 DOUBLE PRECISION NOT NULL, -- ε₀ Initial error tolerance
  psi_0 DOUBLE PRECISION NOT NULL,     -- ψ₀ Initial psi-profile weight
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full calibration vectors
CREATE TABLE calibration_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  device_profile_id UUID REFERENCES device_profiles(id),
  cognitive_profile_id UUID REFERENCES cognitive_profiles(id),
  psi_profile_id UUID REFERENCES psi_profiles(id),
  platform_profile_id UUID REFERENCES platform_profiles(id),
  mission_profile_id UUID REFERENCES mission_profiles(id),
  state_vector_id UUID REFERENCES initial_state_vectors(id),
  agent_tone agent_tone NOT NULL,
  lambda_sensitivity DOUBLE PRECISION NOT NULL,
  gamma_tolerance DOUBLE PRECISION NOT NULL,
  environment_class environment_class NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  checksum TEXT NOT NULL,
  calibrated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Telemetry capsules (runtime data)
CREATE TABLE telemetry_capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  calibration_id UUID REFERENCES calibration_vectors(id),
  source TEXT NOT NULL,
  phi DOUBLE PRECISION NOT NULL,
  lambda DOUBLE PRECISION NOT NULL,
  gamma DOUBLE PRECISION NOT NULL,
  xi DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  checksum TEXT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_operators_user_id ON operators(user_id);
CREATE INDEX idx_device_profiles_operator ON device_profiles(operator_id);
CREATE INDEX idx_calibration_vectors_operator ON calibration_vectors(operator_id);
CREATE INDEX idx_calibration_vectors_active ON calibration_vectors(is_active);
CREATE INDEX idx_telemetry_capsules_operator ON telemetry_capsules(operator_id);
CREATE INDEX idx_telemetry_capsules_time ON telemetry_capsules(captured_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE psi_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE initial_state_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE calibration_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_capsules ENABLE ROW LEVEL SECURITY;

-- Operators: users can only see/modify their own data
CREATE POLICY operators_select ON operators
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY operators_insert ON operators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY operators_update ON operators
  FOR UPDATE USING (auth.uid() = user_id);

-- Device profiles: linked to operator
CREATE POLICY device_profiles_access ON device_profiles
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- Cognitive profiles: linked to operator
CREATE POLICY cognitive_profiles_access ON cognitive_profiles
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- Psi profiles: linked to operator
CREATE POLICY psi_profiles_access ON psi_profiles
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- Platform profiles: linked to operator
CREATE POLICY platform_profiles_access ON platform_profiles
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- Mission profiles: linked to operator
CREATE POLICY mission_profiles_access ON mission_profiles
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- State vectors: linked to operator
CREATE POLICY state_vectors_access ON initial_state_vectors
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- Calibration vectors: linked to operator
CREATE POLICY calibration_vectors_access ON calibration_vectors
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- Telemetry capsules: linked to operator
CREATE POLICY telemetry_capsules_access ON telemetry_capsules
  FOR ALL USING (
    operator_id IN (SELECT id FROM operators WHERE user_id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Compute Xi (negentropic efficiency)
CREATE OR REPLACE FUNCTION compute_xi(
  p_lambda DOUBLE PRECISION,
  p_phi DOUBLE PRECISION,
  p_gamma DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN (p_lambda * p_phi) / GREATEST(p_gamma, 0.001);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER operators_updated_at
  BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════
-- VIEWS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Active calibration view
CREATE OR REPLACE VIEW active_calibrations AS
SELECT
  cv.*,
  isv.lambda_0,
  isv.phi_0,
  isv.gamma_0,
  isv.tau_0,
  isv.epsilon_0,
  isv.psi_0,
  compute_xi(isv.lambda_0, isv.phi_0, isv.gamma_0) as xi_0,
  o.display_name as operator_name,
  o.organization
FROM calibration_vectors cv
JOIN initial_state_vectors isv ON cv.state_vector_id = isv.id
JOIN operators o ON cv.operator_id = o.id
WHERE cv.is_active = TRUE;

-- Telemetry summary view
CREATE OR REPLACE VIEW telemetry_summary AS
SELECT
  operator_id,
  COUNT(*) as capsule_count,
  AVG(phi) as avg_phi,
  AVG(lambda) as avg_lambda,
  AVG(gamma) as avg_gamma,
  AVG(xi) as avg_xi,
  MIN(captured_at) as first_capsule,
  MAX(captured_at) as last_capsule
FROM telemetry_capsules
GROUP BY operator_id;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHYSICAL CONSTANTS TABLE (READ-ONLY REFERENCE)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE physical_constants (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  symbol TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  unit TEXT,
  description TEXT,
  immutable BOOLEAN DEFAULT TRUE
);

INSERT INTO physical_constants (name, symbol, value, unit, description) VALUES
  ('Universal Memory Constant', 'ΛΦ', 2.176435e-8, 's⁻¹', 'Lambda-Phi constant'),
  ('Torsion Lock Angle', 'θ_lock', 51.843, 'degrees', 'Phase-locked torsion angle'),
  ('Consciousness Threshold', 'Φ_threshold', 7.6901, NULL, 'IIT integrated information threshold'),
  ('Fixed Point Decoherence', 'Γ_fixed', 0.092, NULL, 'Baseline decoherence rate'),
  ('Phase Conjugate Coupling', 'χ_pc', 0.869, NULL, 'Phase conjugate coupling strength'),
  ('Golden Ratio', 'φ', 1.618033988749895, NULL, 'Divine proportion');

-- Make physical constants read-only
CREATE POLICY physical_constants_readonly ON physical_constants
  FOR ALL USING (FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- GRANTS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Grant access to authenticated users
GRANT SELECT ON physical_constants TO authenticated;
GRANT ALL ON operators TO authenticated;
GRANT ALL ON device_profiles TO authenticated;
GRANT ALL ON cognitive_profiles TO authenticated;
GRANT ALL ON psi_profiles TO authenticated;
GRANT ALL ON platform_profiles TO authenticated;
GRANT ALL ON mission_profiles TO authenticated;
GRANT ALL ON initial_state_vectors TO authenticated;
GRANT ALL ON calibration_vectors TO authenticated;
GRANT ALL ON telemetry_capsules TO authenticated;
GRANT SELECT ON active_calibrations TO authenticated;
GRANT SELECT ON telemetry_summary TO authenticated;
