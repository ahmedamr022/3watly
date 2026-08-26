"""
MAJRA Weighted Matching Intelligence Engine
Calculates true market-fit percentage between Candidate Profile & Target Job.
"""

from typing import List, Dict, Any, Set, Optional


class MatchingEngine:
    """
    Weighted Candidate-to-Job Matching Engine based on Egyptian labor market demand.
    """

    def __init__(
        self,
        required_weight_ratio: float = 0.75,
        preferred_weight_ratio: float = 0.25,
        experience_bonus_max: float = 5.0,
        location_bonus_max: float = 5.0
    ):
        self.required_weight_ratio = required_weight_ratio
        self.preferred_weight_ratio = preferred_weight_ratio
        self.experience_bonus_max = experience_bonus_max
        self.location_bonus_max = location_bonus_max

    def calculate_match(
        self,
        candidate_skills: List[str],
        job_required_skills: List[str],
        job_preferred_skills: Optional[List[str]] = None,
        candidate_experience_years: int = 1,
        job_seniority: Optional[str] = "Junior",
        candidate_preferred_locations: Optional[List[str]] = None,
        job_location: Optional[str] = "Cairo, Egypt",
        job_is_remote: bool = False
    ) -> Dict[str, Any]:
        """
        Computes weighted match percentage, matched skills, and prioritized skill gaps.
        """
        if job_preferred_skills is None:
            job_preferred_skills = []
        if candidate_preferred_locations is None:
            candidate_preferred_locations = ["Cairo", "Giza", "Remote"]

        # Normalize skill names for case-insensitive matching
        cand_set = {s.strip().lower() for s in candidate_skills if s}
        req_set = {s.strip().lower() for s in job_required_skills if s}
        pref_set = {s.strip().lower() for s in job_preferred_skills if s}

        # 1. Calculate Skill Overlap
        matched_required = req_set.intersection(cand_set)
        missing_required = req_set.difference(cand_set)

        matched_preferred = pref_set.intersection(cand_set)
        missing_preferred = pref_set.difference(cand_set)

        # Weighted calculation
        total_skills_count = len(req_set) + len(pref_set)
        if total_skills_count == 0:
            # Fallback if job has no extracted skills
            raw_skill_score = 70.0
        else:
            req_score = (len(matched_required) / len(req_set)) * 100.0 if req_set else 100.0
            pref_score = (len(matched_preferred) / len(pref_set)) * 100.0 if pref_set else 100.0

            if req_set and pref_set:
                raw_skill_score = (req_score * self.required_weight_ratio) + (pref_score * self.preferred_weight_ratio)
            elif req_set:
                raw_skill_score = req_score
            else:
                raw_skill_score = pref_score

        # 2. Experience Alignment Bonus (0 to 5%)
        exp_bonus = 0.0
        if job_seniority:
            snr = job_seniority.lower()
            if "entry" in snr or "junior" in snr or "fresh" in snr:
                if 0 <= candidate_experience_years <= 2:
                    exp_bonus = 5.0
                elif candidate_experience_years > 2:
                    exp_bonus = 3.0
            elif "mid" in snr:
                if 2 <= candidate_experience_years <= 5:
                    exp_bonus = 5.0
            elif "senior" in snr:
                if candidate_experience_years >= 5:
                    exp_bonus = 5.0

        # 3. Location Alignment Bonus (0 to 5%)
        loc_bonus = 0.0
        if job_is_remote:
            loc_bonus = 5.0
        elif job_location:
            for p_loc in candidate_preferred_locations:
                if p_loc.lower() in job_location.lower():
                    loc_bonus = 5.0
                    break

        # 4. Final Aggregated Score
        final_score = min(100.0, max(0.0, raw_skill_score * 0.90 + exp_bonus + loc_bonus))

        # 5. Build Actionable Next Move / Gap Insights
        actionable_gaps = []
        for s in list(missing_required)[:3]:
            actionable_gaps.append({
                "skill": s.title(),
                "priority": "HIGH",
                "reason": "Required for this role in the Egyptian job market"
            })
        for s in list(missing_preferred)[:2]:
            actionable_gaps.append({
                "skill": s.title(),
                "priority": "MEDIUM",
                "reason": "Preferred bonus skill for higher ranking"
            })

        return {
            "match_score": round(final_score, 1),
            "match_tier": "High Match" if final_score >= 75 else ("Good Match" if final_score >= 50 else "Stretch Role"),
            "matched_required_skills": [s.title() for s in matched_required],
            "matched_preferred_skills": [s.title() for s in matched_preferred],
            "missing_required_skills": [s.title() for s in missing_required],
            "missing_preferred_skills": [s.title() for s in missing_preferred],
            "bonuses": {
                "experience_bonus": exp_bonus,
                "location_bonus": loc_bonus
            },
            "actionable_gaps": actionable_gaps
        }
