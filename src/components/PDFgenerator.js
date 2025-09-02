import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf/dist/polyfills.es.js';

// Import a base64 encoded logo to avoid external URL issues.
// This is a generic placeholder logo.
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARKSURBVHhe7Z1vy21VFMfP9XtLg8aYmEAC0ZTU0ogpCZEaESF5A4b/QM0g/0GFJEyE5A0kCA0j/gAJKRIbJtIYjBTTGzO9N/d1et+5z9l7rbX3PJuBe5/L7Puda5+9z1prn3vPOUoikUgikUgikUgkEilKkavpGNX4Zp6SgY5PxgP/yp+c/x/D0+EGeA/+fR/yA/wM34d34R/h1Rhv/Df8Nl6Fz2ECv+V3sA+fxGgO+yvg7zC8j/018An8E76Nn+F3eC/25zC+n/07+CX8PHz/9+A/+Bf8PfzlP/ATfIafwP/g/6L/C3yL/0P4+3sYfxn/gLfiTdhv+G/Y/g/g3+H/47/A38B/ws/gH/DX8C/xJ/gN/Af+If6P/xn/Bv8e/8V/jn+N/4n/jv+P/4r/gP+H/4R/g7+Af4N/gr+A/4Z/gH+A/w9/An8C/wJ/BP8Kfwp/Cv8Kfwp/Cv+C/oE9gm8N/wB/AH8L/wh/Bv8Kfwp/Cf+A/oP8B/w//CX8A/wT/AP8E/wD/BP8E/wD/CP8A/wD/CP8A/wT/AP8E/wj/AP8I/wD/CP8E/wT/AP8I/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wz/DP+M/wT/AP8I/wT/DP+M/wD/AP8I/wD/CP8E/wD/AP8I/wD/BP8A/wD/CP8A/wT/AP8I/wz/DP8M/wz/DP+M/wz/DP+M/wT/CP8E/wj/DP8E/wj/CP8A/wT/CP8A/wj/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wj/BP8M/wz/DP8M/wz/DP8M/wj/AP8I/wz/AP8I/wT/AP8A/wT/CP8A/wD/BP8A/wD/CP8A/wT/CP8A/wT/CP8A/wT/CP8A/wj/BP8A/wj/DP8M/wz/DP8M/wz/DP8M/wT/DP8M/wz/DP+M/wz/DP+M/wz/DP+M/wT/AP8I/wT/AP8I/wT/AP8A/wT/AP8A/wT/AP8E/wD/AP8E/wD/AP8I/wT/AP8I/wj/CP8M/wz/DP8M/wz/DP8M/wT/DP8M/wz/DP+M/wz/DP8M/wz/CP8E/wj/CP8E/wj/AP8A/wT/AP8E/wT/CP8A/wD/AP8E/wD/AP8A/wT/AP8E/wT/AP8E/wT/AP8E/wD/CP8E/wj/CP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/CP8E/wz/DP8M/wz/DP8M/wT/AP8I/wj/CP8M/wT/CP8A/wD/CP8A/wD/AP8A/wD/AP8A/wT/CP8A/wT/CP8A/wT/AP8E/wT/CP8A/wj/BP8A/wj/CP8A/wj/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/wz/DP8M/w-tIpFIJBKJRCKRSCQSiUQikUgkEolEpXgH0L2WdG8Y/eEAAAAASUVORK5CYII=';

export const generateSuratPerjalananPDF = (data) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFont('helvetica');

    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;

    // --- PAGE 1 ---

    // 1. Header with Logo
    // Add logo image. Position: 15mm from left, 15mm from top. Size: 30x30 mm
    doc.addImage(logoBase64, 'PNG', margin, margin, 30, 30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PERJALANAN DINAS', pageWidth - margin, margin + 10, { align: 'right' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nomor: ${data.nomorSurat || 'SPPD.XX/DH/XX/XXXX-B'}`, pageWidth - margin, margin + 18, { align: 'right' });

    // 2. Main Details Table
    const mainDetailsY = margin + 40;
    doc.autoTable({
      startY: mainDetailsY,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: { top: 1.5, right: 2, bottom: 1.5, left: 0 },
        valign: 'top',
      },
      body: [
        [{ content: 'Diberikan kepada:', styles: { fontStyle: 'normal', minCellHeight: 10 } }],
        [{ content: 'Nama', styles: { fontStyle: 'bold' } }, ':', data.nama || ''],
        [{ content: 'Jabatan', styles: { fontStyle: 'bold' } }, ':', data.jabatan || ''],
        [{ content: 'Tujuan', styles: { fontStyle: 'bold' } }, ':', data.tujuan || ''],
        [{ content: 'Keperluan', styles: { fontStyle: 'bold' } }, ':', data.keperluan || ''],
        [
          { content: 'Mulai Tanggal', styles: { fontStyle: 'bold' } },
          ':',
          formatSimpleDate(data.tanggalMulai)
        ],
        [
          { content: 'Sampai dengan', styles: { fontStyle: 'bold' } },
          ':',
          formatSimpleDate(data.tanggalSelesai)
        ],
        [{ content: 'Dasar pelaksanaan', styles: { fontStyle: 'bold' } }, ':', ''],
      ],
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 5 },
        2: { cellWidth: 'auto' },
      },
    });

    // 3. Other Details Table
    let finalY = doc.lastAutoTable.finalY + 5;
    doc.autoTable({
      startY: finalY,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: { top: 1.5, right: 2, bottom: 1.5, left: 0 } },
      body: [
        [{ content: 'Keterangan lain-lain:', styles: { fontStyle: 'normal', minCellHeight: 8 } }],
        ['Biaya Perjalanan dinas', ':', data.biayaPerjalanan || ''],
        ['Fasilitas Transport', ':', data.fasilitasTransport || ''],
        ['Fasilitas Penginapan', ':', data.fasilitasPenginapan || ''],
        [
          'Pengikut',
          ':',
          data.pengikut && data.pengikut.length > 0 ? data.pengikut.join('\n') : '-',
        ],
      ],
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'normal' },
        1: { cellWidth: 5 },
        2: { cellWidth: 'auto' },
      },
    });

    // 4. Closing Statement
    finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Demikian surat tugas ini dikeluarkan untuk dapat dilaksanakan dengan sebaik-baiknya dan penuh tanggung jawab.',
      margin,
      finalY,
      { maxWidth: pageWidth - margin * 2 }
    );

    // 5. Signature Section
    const issueDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
    const signatureX = pageWidth - 80; // Align to the right
    let signatureY = finalY + 20;

    doc.autoTable({
        startY: signatureY,
        theme: 'plain',
        tableWidth: 'wrap',
        margin: { left: signatureX },
        styles: { fontSize: 10, cellPadding: 0, halign: 'left' },
        body: [
            [{content: 'Dikeluarkan', styles: {cellWidth: 25}}, ':', 'Batam'],
            ['Pada tanggal', ':', formatDate(issueDate)],
            [{ content: '\nPT Bandara Internasional Batam', colSpan: 3, styles: { minCellHeight: 10 } }],
            [{ content: 'a.n Direktur Hukum & SDM', colSpan: 3 }],
            [{ content: 'u.b VP Human Capital & GA', colSpan: 3 }],
            [{ content: '\n\n\nI Wayan Widana', colSpan: 3, styles: { fontStyle: 'bold', minCellHeight: 30 } }]
        ],
        columnStyles: { 1: { cellWidth: 5 } }
    });


    // --- PAGE 2 ---
    doc.addPage();

    // 1. Travel Details Section
    const tableBody = [
        ['I.', 'Berangkat dari:', 'Batam', 'a.n. DIREKSI'],
        ['', '(tempat kedudukan)'],
        ['', 'Pada tanggal', ': ____________________', 'DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA'],
        ['', 'Ke', ': ____________________', 'u.b.'],
        ['', '', '', 'VP HUMAN CAPITAL & GENERAL AFFAIR'],
        ['', '', ''],
        ['', '', '', { content: '\n\n\nI WAYAN WIDANA', styles: { fontStyle: 'bold', minCellHeight: 30 } }]
    ];

    doc.autoTable({
        startY: margin,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1, valign: 'top' },
        body: tableBody,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { halign: 'center' }
        }
    });
    
    finalY = doc.lastAutoTable.finalY + 5;

    // 2. Arrival/Departure Details
    const arrivalBody = [
        ['II.', 'Tiba di', ': ____________________', 'Berangkat dari', ': ____________________'],
        ['', 'Pada tanggal', ': ____________________', 'Ke', ': ____________________'],
        ['', '', '', 'Pada tanggal', ': ____________________'],
    ];

     doc.autoTable({
        startY: finalY,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1 },
        body: arrivalBody,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { cellWidth: 30 },
            4: { cellWidth: 'auto'},
        }
    });

    finalY = doc.lastAutoTable.finalY + 5;
    
    // 3. Return Details & Signature
    const returnBody = [
        ['III.', 'Tiba kembali di', ': ____________________', 'a.n. DIREKSI'],
        ['', '(tempat kedudukan)'],
        ['', 'Pada tanggal', ': ____________________', 'DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA'],
        ['', '', '', 'u.b.'],
        ['', '', '', 'VP HUMAN CAPITAL & GENERAL AFFAIR'],
        ['', '', ''],
        ['', '', '', { content: '\n\n\nI WAYAN WIDANA', styles: { fontStyle: 'bold', minCellHeight: 30 } }]
    ];
    
     doc.autoTable({
        startY: finalY,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1, valign: 'top' },
        body: returnBody,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { halign: 'center' }
        }
    });
    
    finalY = doc.lastAutoTable.finalY + 5;

    // 4. Final Notes
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('IV. Catatan lain-lain:', margin, finalY);
    doc.text(
      'Telah diperiksa, dengan keterangan bahwa perjalanan tersebut benar dilakukan atas perintah dan semata-mata untuk kepentingan jabatan dalam waktu yang sesingkat-singkatnya.',
      margin,
      finalY + 10,
      { maxWidth: pageWidth / 2 - margin }
    );


    // --- SAVE DOCUMENT ---
    const filename = `SPPD_${data.nama.replace(/\s+/g, '_')}_${formatDateForFilename(issueDate)}.pdf`;
    doc.save(filename);

    console.log('PDF generated successfully');
    return true;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal generate PDF: ' + error.message);
  }
};

// Helper functions to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatSimpleDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  // Format to dd-MMM-yy
  return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
};

const formatDateForFilename = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

// Default export
export default { generateSuratPerjalananPDF };