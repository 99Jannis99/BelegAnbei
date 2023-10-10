// moduleCalculation.tsx
const useShouldShowDatevAsMain = (modules: any) => {
  
    // Berechnet die Anzahl der aktiven Hauptmodule.
    // Hauptmodule können entweder ein Boolean-Wert sein oder ein Objekt mit weiteren Modulen.
    // - Wenn es ein Boolean ist und `true`, wird es als aktives Modul gezählt.
    // - Wenn es ein Objekt ist, wird es als aktiv gezählt, wenn mindestens eines seiner untergeordneten Module `true` ist.
    const calculateActiveModules = (modules: any) => {
      return Object.values(modules).filter(
        (item: any) =>
          (typeof item === "boolean" && item === true) ||
          (typeof item === "object" && Object.values(item).includes(true))
      ).length;
    };
  
    // Berechnet die Anzahl der aktiven DATEV-Module.
    // Jedes Modul im `datev`-Objekt ist ein Boolean-Wert, der angibt, ob es aktiv ist oder nicht.
    const calculateActiveDatevModules = (datevModules: any) => {
      return Object.values(datevModules).filter((item: any) => item === true).length;
    };
    
    // Ziehe die Anzahl der aktiven Hauptmodule und DATEV-Module unter Verwendung der oben definierten Hilfsfunktionen.
    const activeMainModules = calculateActiveModules(modules);
    const activeDatevModules = calculateActiveDatevModules(modules.datev);
  
    // Bedingung, um festzustellen, ob DATEV als Hauptelement im Navigator angezeigt werden soll:
    // DATEV wird als Hauptelement angezeigt, wenn es mindestens 3 aktive Hauptmodule und mindestens 2 aktive DATEV-Module gibt.
    return activeMainModules >= 3 && activeDatevModules >= 2;
  };
  
  export default useShouldShowDatevAsMain;
  