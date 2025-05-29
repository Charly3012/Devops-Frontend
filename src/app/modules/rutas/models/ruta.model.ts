export interface Ruta {
    id: number,
    id_assignment?: number,
    name: string,
    route_date: string,
    was_successful: number | null,
    problem_description: string | null,
    comments: string | null,
    start_latitude: number,
    start_longitude: number,
    end_latitude: number,
    end_longitude: number,
    created_at?: string | null,
  }