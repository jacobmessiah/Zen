import { createListCollection, Flex, Portal, Select } from "@chakra-ui/react"
import { useState } from "react";


const DOBInput = () => {

    const [componentDateOBJ, setComponentDateOBJ] = useState(new Date())


    const handleMonthChange = (event) => {
        if (!event) return
        const { value } = event
        if (!value) return
        const newDate = new Date(componentDateOBJ)
        newDate.setMonth(parseInt(value[0]))
        setComponentDateOBJ(newDate)
    }


    const handleYearChange = (event) => {
        if (!event) return
        const { value } = event
        if (!value) return

        const newDate = new Date(componentDateOBJ)
        newDate.setFullYear(parseInt(value[0]))
        setComponentDateOBJ(newDate)
    }

    const handleDaysChange = (event) => {
        if (!event) return
        const { value } = event
        if (!value) return
        const newDate = new Date(componentDateOBJ)
        newDate.setDate(parseInt(value[0]))
        setComponentDateOBJ(newDate)

    }

    const monthsCollection = createListCollection({
        items: [
            { value: "0", label: "January" },
            { value: "1", label: "February" },
            { value: "2", label: "March" },
            { value: "3", label: "April" },
            { value: "4", label: "May" },
            { value: "5", label: "June" },
            { value: "6", label: "July" },
            { value: "7", label: "August" },
            { value: "8", label: "September" },
            { value: "9", label: "October" },
            { value: "10", label: "November" },
            { value: "11", label: "December" },
        ],
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
    })

    const currentYear = new Date().getFullYear();

    const yearsCollection = createListCollection({
        items: Array.from({ length: 60 }, (_, index) => {
            const year = (currentYear - index).toString();
            return { value: year, label: year };
        }),
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
    });

    const getDaysInMonth = (month, year) => {
        const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();

        return createListCollection({
            items: Array.from({ length: daysInMonth }, (_, index) => {
                const day = (index + 1).toString();
                return { value: day, label: day };
            }),
            itemToString: (item) => item.label,
            itemToValue: (item) => item.value,
        });
    };




    return (
        <Flex gap="2" w="full" alignItems="center" >
            <Select.Root  onValueChange={handleMonthChange} collection={monthsCollection}  >
                <Select.HiddenSelect />

                <Select.Control   >
                    <Select.Trigger fontSize="md" rounded="lg" pl="2" pr="2" >
                        <Select.ValueText placeholder="Month" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content p="5px" >
                            {monthsCollection.items.map((month) => (<Select.Item key={month.value} fontSize="md" padding="10px" rounded="md" item={month} >
                                {month.label} <Select.ItemIndicator />
                            </Select.Item>))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>

            <Select.Root onValueChange={handleDaysChange} collection={getDaysInMonth(componentDateOBJ.getMonth(), componentDateOBJ.getFullYear())}  >
                <Select.HiddenSelect />

                <Select.Control   >
                    <Select.Trigger fontSize="md" rounded="lg" pl="2" pr="2" >
                        <Select.ValueText placeholder="Day" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content p="5px" >
                            {getDaysInMonth(componentDateOBJ.getMonth(), componentDateOBJ.getFullYear()).items.map((day) => (<Select.Item fontSize="md" padding="10px" rounded="md" item={day} key={day.value} >
                                {day.label} <Select.ItemIndicator />
                            </Select.Item>))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>

            <Select.Root onValueChange={handleYearChange} collection={yearsCollection}  >
                <Select.HiddenSelect />

                <Select.Control   >
                    <Select.Trigger fontSize="md" rounded="lg" pl="2" pr="2" >
                        <Select.ValueText placeholder="Year" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>

                <Portal>
                    <Select.Positioner>
                        <Select.Content p="5px" >
                            {yearsCollection.items.map((year) => (<Select.Item key={year.value} fontSize="md" padding="10px" rounded="md" item={year} >
                                {year.label} <Select.ItemIndicator />
                            </Select.Item>))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>

        </Flex>
    )
}

export default DOBInput
