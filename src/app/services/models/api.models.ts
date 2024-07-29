export interface PersonDetailApiModel {
    id: number;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    name: string;
    homeworldName?: string;
    homeworldId?: number;
    homeworldUrl: string;
    description: string;
}

export interface PlanetDetailApiModel {
    id: number;
    diameter: string;
    rotation_period: string;
    orbital_period: string;
    gravity: string;
    population: string;
    climate: string;
    terrain: string;
    surface_water: string;
    name: string;
    description: string;
}