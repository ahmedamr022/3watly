"""
MAJRA NLP Skill Extractor Service
Loads Skill Ontology and extracts canonical skills, seniority, and required vs preferred flags
from unstructured job descriptions.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Any, Tuple, Optional
from app.core.config import settings


class NLPSkillExtractor:
    """
    Extracts canonical skills from job descriptions using the MAJRA Skill Ontology.
    """

    def __init__(self, ontology_path: Optional[str] = None):
        if ontology_path is None:
            ontology_path = settings.DATA_PATH / "skill_ontology.json"

        self.ontology_path = Path(ontology_path)
        self.alias_to_skill_map: Dict[str, Dict[str, Any]] = {}
        self.canonical_skills: Dict[str, Dict[str, Any]] = {}
        self._load_ontology()

    def _load_ontology(self) -> None:
        """Loads and compiles ontology into quick lookup mapping"""
        if not self.ontology_path.exists():
            return

        with open(self.ontology_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for cat in data.get("categories", []):
            cat_name = cat.get("name", "General")
            for skill in cat.get("skills", []):
                s_id = skill.get("id")
                s_name = skill.get("name")
                skill_info = {
                    "id": s_id,
                    "name": s_name,
                    "category": cat_name,
                    "related": skill.get("related_skills", [])
                }
                self.canonical_skills[s_id] = skill_info

                # Map canonical name and all aliases to this skill
                self.alias_to_skill_map[s_name.lower()] = skill_info
                for alias in skill.get("aliases", []):
                    self.alias_to_skill_map[alias.lower().strip()] = skill_info

    def extract_skills_from_text(self, text: str) -> Dict[str, Any]:
        """
        Scans text for skills and determines if they are Required or Preferred.
        """
        if not text:
            return {"required_skills": [], "preferred_skills": [], "all_detected_skills": []}

        lower_text = text.lower()
        found_skills: Dict[str, Dict[str, Any]] = {}

        # Heuristic keywords for required vs preferred sections
        required_patterns = [r"must have", r"required", r"requirements", r"qualifications", r"essential", r"proficiency in"]
        preferred_patterns = [r"nice to have", r"plus", r"preferred", r"bonus", r"good to have", r"advantageous"]

        # Sort aliases by length descending to match longest phrases first (e.g. 'react native' before 'react')
        sorted_aliases = sorted(self.alias_to_skill_map.keys(), key=len, reverse=True)

        for alias in sorted_aliases:
            # Word boundary regex to prevent substring false positives (e.g., 'c' inside 'cloud')
            escaped_alias = re.escape(alias)
            # Allow special characters like C++, C#, .NET
            pattern = rf"(?<!\w){escaped_alias}(?!\w)"
            matches = list(re.finditer(pattern, lower_text))

            if matches:
                skill_info = self.alias_to_skill_map[alias]
                s_id = skill_info["id"]

                if s_id not in found_skills:
                    # Check context around the first match to infer required vs preferred
                    first_pos = matches[0].start()
                    # Context window of 120 chars preceding the skill
                    context = lower_text[max(0, first_pos - 120):first_pos]

                    is_preferred = any(re.search(p, context) for p in preferred_patterns)
                    is_required = any(re.search(p, context) for p in required_patterns)

                    importance = "preferred" if is_preferred and not is_required else "required"

                    found_skills[s_id] = {
                        "id": s_id,
                        "name": skill_info["name"],
                        "category": skill_info["category"],
                        "importance": importance
                    }

        required_list = [s["name"] for s in found_skills.values() if s["importance"] == "required"]
        preferred_list = [s["name"] for s in found_skills.values() if s["importance"] == "preferred"]

        return {
            "required_skills": required_list,
            "preferred_skills": preferred_list,
            "all_detected_skills": list(found_skills.values())
        }
