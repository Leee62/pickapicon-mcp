/** get all icon repo names */
export async function getIconRepoNames<T>(): Promise<T | null> {
  try {
    const res = await fetch(`https://api.iconify.design/collections`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

/** get icon collection by prefix And desc (LIKE AS ant-design) */
export async function searchIconsByPrefixAndDesc<T>(
  prefix: string,
  desc: string
): Promise<T | null> {
  try {
    const res = await fetch(
      `https://api.iconify.design/search?query=${desc}&prefix=${prefix}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

/** get icon by prefix and svg name */
export async function getIconByPrefixAndName<T>(
  prefix: string,
  svgName: string
): Promise<T | null> {
  try {
    const res = await fetch(
      `https://api.iconify.design/${prefix}/${svgName}.svg`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return (await res.text()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}
