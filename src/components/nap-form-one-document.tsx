
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, renderToFile } from '@react-pdf/renderer';


// Font.register({
//     family: 'SanSerif', 
//     fonts: [
//         { src: 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
//     ]
// });



const cellHeight = {
    sm: 30,
    md: 45,
    lg: 135,
}
const pageDPI = 72

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        paddingHorizontal: 0.5 * pageDPI,
        boxSizing: 'border-box',
        paddingVertical: .25 * pageDPI,

    },
    super_header: {
        height: 1.1 * pageDPI,
    },
    super_header_width: { // first row
        first: (1.77 + 0.98 + 0.54) * pageDPI,
        second: (0.82 + 0.84 + 0.8 + 0.85) * pageDPI,
        third: (0.78 + 0.55 + 0.67 + (1.78 / 3)) * pageDPI,
        fourth: (1.72 + (1.78 * 2 / 3)) * pageDPI,
    },
    col_width: { // second row
        nine: 1.77 * pageDPI,
        ten: 0.98 * pageDPI,
        eleven: 0.54 * pageDPI,
        twelve: 0.82 * pageDPI,
        thirten: 0.84 * pageDPI,
        fourten: 0.8 * pageDPI,
        fifteen: 0.85 * pageDPI,
        sixten: 0.78 * pageDPI,
        seventen: 0.55 * pageDPI,
        eighten: 0.67 * pageDPI,
        nineten: 1.78 * pageDPI,
        twenty: 1.72 * pageDPI,
    },

    column: { // height of second row
        height: 0.35 * pageDPI,
        fontSize: 6
    },
    form: {
        width: 871.20
    },


});


// header size height: 0.31"
// header min with   9: 1.77", 10: 0.98", 11: 0.54",  12: 0.82", 13: 0.84", 14: 0.8", 15: 0.85", 16: 0.78", 
// 17: 0.55", 18: 0.67", 19: 1.78", 20: 1.72"




// Width: 8.50 in × 72 = 612 pt
// Height: 13.00 in × 72 = 936 pt

export default function NapFormOneDocument({ groups, header }: { groups: any, header: any }) {
    return (
        <Document pageMode='fullScreen'>
            <Page orientation='landscape' size='FOLIO' style={[styles.page]}>
                <View style={{ fontSize: 6, width: styles.form.width, marginHorizontal: 'auto' }}>
                    <Text>NAP Records Inventory and Appraisal FormD</Text>
                    <Text> 2024</Text>
                </View>
                <View style={{ width: styles.form.width, marginHorizontal: 'auto' }}>
                    {/* HEADER */}
                    <View style={{ display: 'flex', flexDirection: 'row', fontSize: 8 }}>
                        <View style={{ display: 'flex', borderWidth: 1, padding: 4, width: styles.super_header_width.first, height: styles.super_header.height }}>
                            <View style={{ padding: 10, width: '100%', display: 'flex', flexDirection: 'column', rowGap: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ display: 'flex', flexDirection: 'column', rowGap: 0, alignItems: 'center' }}>
                                    <Text >NATIONAL ARCHIVES OF THE PHILIPPINES</Text>
                                    <Text >Pambansang Sinupan ng Pilipinas</Text>
                                </View>
                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>RECORDS INVENTORY AND APPRAILSAL</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', width: styles.super_header_width.second, height: styles.super_header.height }}>
                            <View style={{ display: 'flex', padding: 3, height: cellHeight.md * 2, borderWidth: 1 }}>
                                <Text>1. NAME OF OFFICE:</Text>
                            </View>
                            <View style={{ display: 'flex', padding: 3, height: cellHeight.md, borderWidth: 1 }}>
                                <Text>6. ADDRESS: </Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: styles.super_header_width.third, height: styles.super_header.height }}>
                            <View style={{ borderWidth: 1, padding: 3, height: cellHeight.md }}><Text>2. DEPARTMENT/DIVISION: </Text></View>
                            <View style={{ borderWidth: 1, padding: 3, height: cellHeight.md }}><Text>3. SECTION/UNIT: </Text></View>
                            <View style={{ borderWidth: 1, padding: 3, height: cellHeight.md }}><Text>7. PERSON-IN-CHARGE OF FILES: </Text></View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: styles.super_header_width.fourth, height: styles.super_header.height }}>
                            <View style={{ borderWidth: 1, padding: 3, height: cellHeight.md }}><Text>4. TELEPHONE NO.: </Text></View>
                            <View style={{ borderWidth: 1, padding: 3, height: cellHeight.md }}><Text>5. EMAIL ADDRESS.: </Text></View>
                            <View style={{ borderWidth: 1, padding: 3, height: cellHeight.md }}><Text>8. DATE PREPARED</Text></View>
                        </View>
                    </View>
                    {/* COLUMN NAMES */}
                    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', fontSize: 6 }}>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.nine, height: styles.column.height }}>
                            <Text>9. RECORDS SERIES TITLE AND DESCRIPTION</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.ten, height: styles.column.height }}>
                            <Text>10. PERIOD COVERED / INCLUSIVE DAYS</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.eleven, height: styles.column.height }}>
                            <Text>11. VOLUME</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.twelve, height: styles.column.height }}>
                            <Text>12. RECORDS MEDIUM</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.thirten, height: styles.column.height }}>
                            <Text>13. RESTRICTION'S</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.fourten, height: styles.column.height }}>
                            <Text> 14. LOCATION OF RECORDS</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.fifteen, height: styles.column.height }}>
                            <Text>15. FREQUENCY OF USE</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.sixten, height: styles.column.height }}>
                            <Text>16. DUPLICATION</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.seventen, height: styles.column.height }}>
                            <Text>17. TIME VALUE (T/P)</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.eighten, height: styles.column.height }}>
                            <Text>18. UTILITY VALUE Adm/F/L/Arc</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: styles.col_width.nineten, height: styles.column.height }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: styles.column.height / 2, width: '100%', borderWidth: 1 }}>
                                <Text>19. RETENTION PERIOD</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTop: 1, }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: styles.col_width.nineten / 3, borderWidth: 1 }}>
                                    <Text>Active</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: styles.col_width.nineten / 3, borderWidth: 1 }}>
                                    <Text>Storage</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: styles.col_width.nineten / 3, borderWidth: 1 }}>
                                    <Text>Total</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, padding: 2, width: styles.col_width.twenty, height: styles.column.height }}>
                            <Text>20. DISPOSITION PROVISION</Text>
                        </View>
                    </View>
                    {/* ROW */}
                    {
                        groups && groups.map((group: any, indx: number) => (
                            

                            <View wrap={false} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', fontSize: 8 }}>
                                <View style={{ display: 'flex', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.nine, }}>
                                    <Text>{("LONGGGGGGddddddeddddGGGddddddeddddGGGddddddssssssssssssssssssssssssssssssseddd".match(/.{1,10}/g) ?? [""]).join(" ")}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.ten, }}>
                                    <Text>10. PERIOD COVERED / INCLUSIVE DAYS</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.eleven, }}>
                                    <Text>11. VOLUME</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.twelve, }}>
                                    <Text>12. RECORDS MEDIUM</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.thirten, }}>
                                    <Text>13. RESTRICTION'S</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.fourten, }}>
                                    <Text> 14. LOCATION OF RECORDS</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.fifteen, }}>
                                    <Text>15. FREQUENCY OF USE</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.sixten, }}>
                                    <Text>16. DUPLICATION</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.seventen, }}>
                                    <Text>17. TIME VALUE (T/P)</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.eighten, }}>
                                    <Text>18. UTILITY VALUE Adm/F/L/Arc</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '3pt', width: styles.col_width.nineten / 3, borderWidth: 1 }}>
                                    <Text>Active</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '3pt', width: styles.col_width.nineten / 3, borderWidth: 1 }}>
                                    <Text>Storage</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '3pt', width: styles.col_width.nineten / 3, borderWidth: 1 }}>
                                    <Text>Total</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: '3pt', width: styles.col_width.twenty, }}>
                                    <Text>20. DISPOSITION PROVISION</Text>
                                </View>
                            </View>
                        ))
                    }


                </View>

            </Page>
        </Document>
    )
}