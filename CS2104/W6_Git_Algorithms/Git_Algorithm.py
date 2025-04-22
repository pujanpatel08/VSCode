def across_bridge(people):
    fast1 = 0
    fast2 = 0
    slow1 = 0
    slow2 = 0
    if people[0] > people[1]:
        if people[0] > people[2]:
            slow1 = people[0]
            if people[1] > people[2]:
                fast1 = people[2]
                if people[1] > people[3]:
                    slow2 = people[1]
                    fast2 = people[3]
                else:
                    slow2 = people[3]
                    fast2 = people[1]
            else:
                fast1 = people[1]
                if people[2] > people[3]:
                    slow2 = people[2]
                    fast2 = people[3]
                else:
                    slow2 = people[3]
                    fast2 = people[2]
        else:
            if people[0] > people[3]:
                slow1 = people[0]
                slow2 = people[2]
                fast1 = people[1]
                fast2 = people[3]
            else:
                fast1 = people[0]
                fast2 = people[1]
                slow1 = people[2]
                slow2 = people[3]
    else:
        if people[1] > people[2]:
            slow1 = people[1]
            if people[0] > people[2]:
                fast1 = people[2]
                if people[0] > people[3]:
                    slow2 = people[0]
                    fast2 = people[3]
                else:
                    slow2 = people[3]
                    fast2 = people[0]
            else:
                fast1 = people[0]
                if people[2] > people[3]:
                    slow2 = people[2]
                    fast2 = people[3]
                else:
                    slow2 = people[3]
                    fast2 = people[2]
        else:
            if people[1] > people[3]:
                slow1 = people[1]
                slow2 = people[2]
                fast1 = people[0]
                fast2 = people[3]
            else:
                fast1 = people[1]
                fast2 = people[0]
                slow1 = people[2]
                slow2 = people[3]
    leg1 = 0
    if fast1 > fast2:
        leg1 = fast1
    else:
        leg1 = fast2
    leg2 = fast1
    leg3 = 0
    if slow1 > slow2:
        leg3 = slow1
    else:
        leg3 = slow2
    leg4 = fast2
    leg5 = leg1
    return leg1 + leg2 + leg3 + leg4 + leg5