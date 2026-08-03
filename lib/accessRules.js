export function canAccessTest(test, isPremium) {
  return test.price_inr === 0 || isPremium;
}

export function canAccessMaterial(material, isPremium) {
  return !material.is_premium || isPremium;
}

export function canAccessConcept(concept, isPremium) {
  return !concept.is_premium || isPremium;
}
