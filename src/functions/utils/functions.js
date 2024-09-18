function dateFormatterInv(dateString) {
  // Diviser la chaîne de date en année, mois et jour
  if (dateString) {
    const [annee, mois, jour] = dateString.split("-");

    // Créer un objet Date en spécifiant l'année, le mois et le jour
    const date = new Date(annee, mois - 1, jour);

    return date;
  } else {
    return new Date();
  }
}

export { dateFormatterInv };
