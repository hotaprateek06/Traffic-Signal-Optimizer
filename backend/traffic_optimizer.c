#include <stdio.h>
#include <stdlib.h>

struct Road {
    char name;
    int vehicles;
    int waiting_time;
    int priority;
};

int main(int argc, char *argv[])
{
    if(argc != 5)
    {
        printf("Invalid input\n");
        return 1;
    }

    struct Road r[4];
    char names[4] = {'A','B','C','D'};

    int i, cycle, max_index;

    // Initialize roads
    for(i = 0; i < 4; i++)
    {
        r[i].name = names[i];
        r[i].vehicles = atoi(argv[i+1]);
        r[i].waiting_time = 0;
    }

    // Run 3 cycles (can increase later)
    for(cycle = 1; cycle <= 3; cycle++)
    {
        // Calculate priority
        for(i = 0; i < 4; i++)
        {
            r[i].priority = r[i].vehicles + r[i].waiting_time;
        }

        // Find max priority road
        max_index = 0;
        for(i = 1; i < 4; i++)
        {
            if(r[i].priority > r[max_index].priority)
            {
                max_index = i;
            }
        }

        int green_time = 10 + (r[max_index].vehicles / 2);

        printf("Cycle %d:\n", cycle);
        printf("Green Road: %c\n", r[max_index].name);
        printf("Vehicles: %d\n", r[max_index].vehicles);
        printf("Green Time: %d\n", green_time);

        // Vehicles pass
        int passed = green_time / 2;
        r[max_index].vehicles -= passed;

        if(r[max_index].vehicles < 0)
            r[max_index].vehicles = 0;

        // Update waiting time
        for(i = 0; i < 4; i++)
        {
            if(i == max_index)
                r[i].waiting_time = 0;
            else
                r[i].waiting_time += 5;
        }

        printf("----\n");
    }

    return 0;
}