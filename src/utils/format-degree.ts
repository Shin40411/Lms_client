export default function getDegreeLabel(degree: string): string {
    switch (degree) {
        case 'BACHELOR':
            return 'Cử nhân';
        case 'MASTER':
            return 'Thạc sĩ';
        case 'DOCTOR':
            return 'Tiến sĩ';
        default:
            return degree;
    }
};