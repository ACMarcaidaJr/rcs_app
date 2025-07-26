"use client"
import { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, renderToFile } from '@react-pdf/renderer';
import os from 'os'
import path from 'path';

// Create styles
// const styles = StyleSheet.create({
//     page: {
//         flexDirection: 'row',
//     },
//     section: {
//         border: 'solid',
//         borderSize: 1,
//         margin: 10,
//         padding: 10,
//         flexGrow: 1
//     }
// });

// STYLES
Font.registerHyphenationCallback(word => {
    return word.length > 18 ? word.match(/.{1,10}/g) ?? [word] : [word];
});
const cellWidth = {
    xsm: 30,
    sm: 100,
    md: 200,
    lg: 300,
    xl: 120,
    xxl: 400,
}
const cellHeight = {
    sm: 30,
    md: 45,
    lg: 135,
}
const styles = StyleSheet.create({
    page: {
        display: 'flex',
        fontSize: 11,
        flexDirection: 'column',
        border: 'solid 1pt',
        gap: 0,
        boxSizing: 'border-box',
        width: 'fit',
    },
    row: {
        flexDirection: 'row',
        borderBottom: '1pt solid black',
    },
    cell: {
        border: '1pt solid black',
        padding: 2,
        justifyContent: 'center',
    },
    header: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

const NapFormOneDocument = () => (
    <Document pageMode='fullScreen'>
        <Page size='A4' style={styles.page}>
            {/* HEADER */}
            <View style={{ display: 'flex', flexDirection: 'row', height: 'fit' }}>
                <View style={{ display: 'flex', border: 'solid 1pt', padding: 4, height: cellHeight.lg, width: cellWidth.xxl }}>
                    <View style={{ padding: 10, width: '100%', display: 'flex', flexDirection: 'column', rowGap: 20, border: 'solid 2pt', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ fontFamily: 'san serif   ', display: 'flex', flexDirection: 'column', rowGap: 0, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', }}>NATIONAL ARCHIVES OF THE PHILIPPINES</Text>
                            <Text style={{ fontStyle: 'italic' }}>Pambansang Sinupan ng Pilipinas</Text>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>RECORDS INVENTORY AND APPRAILSAL</Text>
                        </View>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', width: cellWidth.xxl, }}>
                    <View style={{ display: 'flex', padding: 3, height: cellHeight.md * 2, border: 'solid 1pt' }}>
                        <Text>1. NAME OF OFFICE:</Text>
                    </View>
                    <View style={{ display: 'flex', padding: 3, height: cellHeight.md, border: 'solid 1pt' }}>
                        <Text>6. ADDRESS: </Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: cellWidth.xxl, }}>
                    <View style={{ border: 'solid 1pt', padding: 3, height: cellHeight.md }}><Text>2. DEPARTMENT/DIVISION: </Text></View>
                    <View style={{ border: 'solid 1pt', padding: 3, height: cellHeight.md }}><Text>3. SECTION/UNIT: </Text></View>
                    <View style={{ border: 'solid 1pt', padding: 3, height: cellHeight.md }}><Text>7. PERSON-IN-CHARGE OF FILES: </Text></View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: cellWidth.xxl, }}>
                    <View style={{ border: 'solid 1pt', padding: 3, height: cellHeight.md }}><Text>4. TELEPHONE NO.: </Text></View>
                    <View style={{ border: 'solid 1pt', padding: 3, height: cellHeight.md }}><Text>5. EMAIL ADDRESS.: </Text></View>
                    <View style={{ border: 'solid 1pt', padding: 3, height: cellHeight.md }}><Text>8. DATE PREPARED</Text></View>
                </View>
            </View>
            {/* COLUMN NAMES */}
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.md, }}>
                    <Text>9. RECORDS SERIES TITLE AND DESCRIPTION</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm + 20 }}>
                    <Text>10. PERIOD COVERED/INCLUSIVE DAYS</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm - 20 }}>
                    <Text>11. VOLUME</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>12. RECORDS MEDIUM</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>13. RESTRICTION'S</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text> 14. LOCATION OF RECORDS</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>15. FREQUENCY OF USE</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>16. DUPLICATION</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>17. TIME VALUE (T/P)</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>17. UTILITY VALUE Adm/F/L/Arc</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', width: cellWidth.lg }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                        <Text>19. RETENTION PERIOD</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTop: '1pt solid ' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: cellWidth.sm, border: '1pt solid' }}>
                            <Text>Active</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: cellWidth.sm, border: '1pt solid' }}>
                            <Text>Storage</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: cellWidth.sm, border: '1pt solid' }}>
                            <Text>Total</Text>
                        </View>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.md }}>
                    <Text>20. DISPOSITION PROVISION</Text>
                </View>
            </View>
            {/* ROW */}
            <View style={{ display: 'flex', flexDirection: 'row', }}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.md, }}>
                    <Text>
                        TITLE AND DESCRIPTIONS CAN BE VERY {("LONGGGGGGddddddeddddGGGddddddeddddGGGdddddhhhhhhhhhhhhhhhhhhhhdjfhsjdfhsdhfsdhfsjdhfjsddeddd".match(/.{1,10}/g) ?? [""]).join("-")} dGGGddddddeddddGGG ddddddeddddGGG
                    </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm + 20 }}>
                    <Text>10. PERIOD COVERED/INCLUSIVE DAYS</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm - 20 }}>
                    <Text>11. VOLUME</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>12. RECORDS MEDIUM</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>13. RESTRICTION'S</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text> 14. LOCATION OF RECORDS</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>15. FREQUENCY OF USE</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>16. DUPLICATION</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>17. TIME VALUE (T/P)</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.sm }}>
                    <Text>17. UTILITY VALUE Adm/F/L/Arc</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: cellWidth.sm, border: '1pt solid' }}>
                    <Text>Active</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: cellWidth.sm, border: '1pt solid' }}>
                    <Text>Storage</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, width: cellWidth.sm, border: '1pt solid' }}>
                    <Text>Total</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', border: '1pt solid ', padding: 2, width: cellWidth.md }}>
                    <Text>20. DISPOSITION PROVISION</Text>
                </View>
            </View>
        </Page>
    </Document>
)

const DownloadNapFormOneDocument = async ()=>{
    const downloadsDir = path.join(os.homedir(), 'Downloads');

    await renderToFile(<NapFormOneDocument />, `${downloadsDir}/NAP-FORM-ONE.pdf`);
}

export default function PreviewNapFormOneDialog() {
    const [isOpePreview, setIsOpenPreview] = useState<boolean>(false)
    return (
        <Dialog open={isOpePreview} onOpenChange={setIsOpenPreview} >
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpenPreview(true)}>
                    Preview
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full h-[90vh] max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>
                        <p>previewing the Nap form one ID: </p>
                        <DialogDescription >
                            <p>eme eme lang muna ito</p>
                        </DialogDescription>
                    </DialogTitle>
                </DialogHeader>
                {/* BODY */}
               <div>
                 <NapFormOneDocument />
                 <div>
                    <Button onClick={DownloadNapFormOneDocument}>
                        Download File
                    </Button>
                 </div>
               </div>

            </DialogContent>
        </Dialog>
    )
} 