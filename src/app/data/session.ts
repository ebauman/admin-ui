export class Session {
    id: string;
    scenario: string;
    course: string;
    user: string;
    vm_claim: string[];
    access_code: string;
    paused: boolean;
    paused_time: Date;
    active: boolean;
    finished: boolean;
    start_time: Date;
    end_time: Date;
}